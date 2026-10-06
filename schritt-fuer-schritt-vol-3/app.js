(function(){
var LESSON={verbs:[
{inf:"können",en:"can / to be able to",note:"modal · singular stem change",forms:[["ich","kann"],["du","kannst"],["er / sie / es","kann"],["wir","können"],["ihr","könnt"],["sie / Sie","können"]],examples:[["Ich kann Deutsch sprechen.","I can speak German."],["Kannst du das machen?","Can you do that?"]]},
{inf:"müssen",en:"must / to have to",note:"modal · singular stem change",forms:[["ich","muss"],["du","musst"],["er / sie / es","muss"],["wir","müssen"],["ihr","müsst"],["sie / Sie","müssen"]],examples:[["Ich muss heute arbeiten.","I have to work today."],["Musst du jetzt gehen?","Do you have to go now?"]]},
{inf:"wollen",en:"to want to",note:"modal · singular stem change",forms:[["ich","will"],["du","willst"],["er / sie / es","will"],["wir","wollen"],["ihr","wollt"],["sie / Sie","wollen"]],examples:[["Ich will nach Hause gehen.","I want to go home."],["Willst du mitkommen?","Do you want to come along?"]]},
{inf:"dürfen",en:"may / to be allowed to",note:"modal · singular stem change",forms:[["ich","darf"],["du","darfst"],["er / sie / es","darf"],["wir","dürfen"],["ihr","dürft"],["sie / Sie","dürfen"]],examples:[["Ich darf heute bleiben.","I’m allowed to stay today."],["Darfst du hier parken?","Are you allowed to park here?"]]},
{inf:"sollen",en:"should / to be supposed to",note:"modal · singular stem change",forms:[["ich","soll"],["du","sollst"],["er / sie / es","soll"],["wir","sollen"],["ihr","sollt"],["sie / Sie","sollen"]],examples:[["Ich soll mehr lernen.","I should study more."],["Sollst du ihn anrufen?","Are you supposed to call him?"]]}
]};
var modes={meaning:"Meaning",conjugation:"Conjugation",sentence:"Sentence completion",reverse:"Reverse recall",pattern:"Modal sentence",singular:"Singular change"};
var state={verb:0,mode:"conjugation",count:0,correct:0,answered:false,q:null,cardPool:[],cardIndex:0,cardDirection:"prompt-form"};
var key="rd-schritt-fuer-schritt-vol3-v1";
var progress;
try{progress=JSON.parse(localStorage.getItem(key)||'{"mastered":{},"review":{},"attempts":0,"correct":0}')}catch(e){progress={mastered:{},review:{},attempts:0,correct:0}}
if(!progress.mastered)progress.mastered={};if(!progress.review)progress.review={};

function $(s){return document.querySelector(s)}
function $$(s){return Array.prototype.slice.call(document.querySelectorAll(s))}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function shuffle(a){return a.slice().sort(function(){return Math.random()-.5})}
function save(){localStorage.setItem(key,JSON.stringify(progress));updateProgress()}
function formKey(v,f){return v.inf+":"+f[0]}
function speakGerman(text){if(!("speechSynthesis" in window))return;window.speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(text);u.lang="de-DE";u.rate=.82;window.speechSynthesis.speak(u)}
function speakControl(text,label){return '<button type="button" class="hear hear-german speak-control" data-speak="'+encodeURIComponent(text)+'">🔊 '+(label||"Hear German")+'</button>'}

function renderVerbs(){
  var g=$("#verbGrid");
  g.innerHTML=LESSON.verbs.map(function(v,i){return '<button class="verbchip '+(i===state.verb?"active":"")+'" data-i="'+i+'"><strong>'+v.inf+'</strong><span>'+v.en+'</span></button>'}).join("");
  $$(".verbchip").forEach(function(b){b.onclick=function(){state.verb=+b.dataset.i;renderVerbs();renderLesson()}});
}
function renderLesson(){
  var v=LESSON.verbs[state.verb];
  $("#lesson").innerHTML='<div class="lessontop"><div><h3 class="verbtitle">'+v.inf+'</h3><div class="meaning">'+v.en+' · <strong>'+v.note+'</strong></div><span class="singular-badge">Watch the singular: '+v.forms[0][1]+' · '+v.forms[1][1]+' · '+v.forms[2][1]+'</span></div>'+speakControl(v.inf,"Hear infinitive")+'</div>'
  +'<div class="tablewrap"><table class="conj"><thead><tr><th>Person</th><th>Präsens</th><th>Pronunciation</th></tr></thead><tbody>'
  +v.forms.map(function(f){return '<tr><td>'+f[0]+'</td><td>'+f[1]+'</td><td>'+speakControl(f[0]+" "+f[1])+'</td></tr>'}).join("")
  +'</tbody></table></div><div class="examples">'
  +v.examples.map(function(x){return '<div class="example"><div class="de">'+x[0]+'</div><div class="en">'+x[1]+'</div><div class="example-pattern">conjugated modal + … + infinitive</div><div style="margin-top:10px">'+speakControl(x[0],"Hear sentence")+'</div></div>'}).join("")
  +'</div>';
}

function allCards(){
  var out=[];
  LESSON.verbs.forEach(function(v,vi){v.forms.forEach(function(f,fi){out.push({id:out.length+1,vi:vi,fi:fi,v:v,f:f,key:formKey(v,f)})})});
  return out;
}
function exampleFor(c){return c.v.examples[c.fi%c.v.examples.length]}
function resetCardPool(){var filter=$("#cardVerbFilter").value;state.cardPool=allCards().filter(function(c){return filter==="all"||c.v.inf===filter});state.cardIndex=0;renderCard()}
function cardFrontBack(c){
  var dir=state.cardDirection;if(dir==="mixed")dir=c.id%2?"prompt-form":"form-prompt";
  return dir==="prompt-form"?{kick:"Conjugate",front:c.f[0]+" + "+c.v.inf,back:c.f[0]+" "+c.f[1]}:{kick:"Identify",front:c.f[0]+" "+c.f[1],back:c.f[0]+" + "+c.v.inf};
}
function currentCard(){return state.cardPool[state.cardIndex]||allCards()[0]}
function renderCard(){
  var c=currentCard(),fb=cardFrontBack(c),ex=exampleFor(c),card=$("#flashcard");
  card.classList.remove("flipped");card.setAttribute("aria-pressed","false");
  $("#frontNumber").textContent=$("#backNumber").textContent=String(c.id).padStart(2,"0");
  $("#frontKicker").textContent=fb.kick;$("#frontPrompt").textContent=fb.front;$("#backAnswer").textContent=fb.back;
  $("#cardExampleDe").textContent=ex[0];$("#cardExampleEn").textContent=ex[1];
  $("#cardPosition").textContent=(state.cardIndex+1)+" / "+state.cardPool.length;$("#cardContext").textContent=c.v.inf+" · modal";
}
function nextCard(){state.cardIndex=(state.cardIndex+1)%state.cardPool.length;renderCard()}
function prevCard(){state.cardIndex=(state.cardIndex-1+state.cardPool.length)%state.cardPool.length;renderCard()}
function shuffleCards(){for(var i=state.cardPool.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),tmp=state.cardPool[i];state.cardPool[i]=state.cardPool[j];state.cardPool[j]=tmp}state.cardIndex=0;renderCard()}
function markCard(type){var c=currentCard();if(type==="known"){progress.mastered[c.key]=1;delete progress.review[c.key]}else{progress.review[c.key]=1;delete progress.mastered[c.key]}save();nextCard()}

function forms(){
  var a=[];
  LESSON.verbs.forEach(function(v){v.forms.forEach(function(f){a.push({verb:v.inf,en:v.en,person:f[0],form:f[1],key:formKey(v,f),v:v,f:f})})});
  return a;
}
function uniqueAnswers(correct,alts){return shuffle([correct].concat(shuffle(Array.from(new Set(alts.filter(function(x){return x!==correct})))).slice(0,3)))}
function question(){
  var all=forms(),v=pick(LESSON.verbs),f=pick(v.forms),q="",correct="",alts=[],extra="";
  if(state.mode==="meaning"){q='What does “'+v.inf+'” mean?';correct=v.en;alts=LESSON.verbs.map(function(x){return x.en});f=null}
  if(state.mode==="conjugation"){q=f[0]+" ____ ("+v.inf+")";correct=f[1];alts=all.map(function(x){return x.form})}
  if(state.mode==="sentence"){
    var ex=pick(v.examples),target=null;
    v.forms.forEach(function(ff){if(!target&&ex[0].toLowerCase().indexOf(ff[1].toLowerCase())>-1)target=ff});
    target=target||f;f=target;q=ex[0].replace(new RegExp(target[1],"i"),"____");correct=target[1];alts=all.map(function(x){return x.form});extra=ex[1];
  }
  if(state.mode==="reverse"){q='“'+f[0]+' '+f[1]+'” belongs to which infinitive?';correct=v.inf;alts=LESSON.verbs.map(function(x){return x.inf})}
  if(state.mode==="pattern"){
    var pairs=[
      {q:"Ich kann Deutsch ____.",a:"sprechen",alts:["spricht","spreche","gesprochen"]},
      {q:"Ich muss heute ____.",a:"arbeiten",alts:["arbeite","arbeitet","gearbeitet"]},
      {q:"Ich will nach Hause ____.",a:"gehen",alts:["gehe","geht","gegangen"]},
      {q:"Ich darf heute ____.",a:"bleiben",alts:["bleibe","bleibt","geblieben"]},
      {q:"Ich soll mehr ____.",a:"lernen",alts:["lerne","lernt","gelernt"]}
    ];
    var p=pick(pairs);q=p.q;correct=p.a;alts=p.alts;f=null;extra="With a modal verb, the second verb stays in the infinitive and usually goes to the end.";
  }
  if(state.mode==="singular"){
    var singular=pick([0,1,2]),vv=pick(LESSON.verbs),ff=vv.forms[singular];
    q=ff[0]+" ____ ("+vv.inf+")";correct=ff[1];alts=vv.forms.map(function(x){return x[1]});v=vv;f=ff;extra="Focus on the strong singular form.";
  }
  return{q:q,correct:correct,answers:uniqueAnswers(correct,alts),v:v,f:f,extra:extra};
}
function renderTabs(){
  $("#tabs").innerHTML=Object.keys(modes).map(function(k){return '<button class="tab '+(k===state.mode?"active":"")+'" data-mode="'+k+'" data-umami-event="vol3-quiz-mode" data-umami-event-mode="'+k+'">'+modes[k]+'</button>'}).join("");
  $$(".tab").forEach(function(b){b.onclick=function(){state.mode=b.dataset.mode;renderTabs();nextQuestion()}});
}
function nextQuestion(){
  state.answered=false;state.q=question();state.count++;
  $("#qMode").textContent=modes[state.mode];$("#qCount").textContent="Question "+state.count;
  $("#question").textContent=state.q.q;$("#answers").innerHTML=state.q.answers.map(function(a){return '<button class="answer" data-a="'+encodeURIComponent(a)+'">'+a+'</button>'}).join("");
  $("#feedback").textContent="";$("#nextBtn").disabled=true;$$(".answer").forEach(function(b){b.onclick=function(){answerQuestion(b,decodeURIComponent(b.dataset.a))}});score();
}
function answerQuestion(btn,a){
  if(state.answered)return;state.answered=true;progress.attempts++;
  var ok=a===state.q.correct;
  if(ok){
    state.correct++;progress.correct++;btn.classList.add("correct");
    if(state.q.f){progress.mastered[formKey(state.q.v,state.q.f)]=1;delete progress.review[formKey(state.q.v,state.q.f)]}
    $("#feedback").textContent="Correct. "+(state.q.extra||"Keep the pattern moving.");
  }else{
    btn.classList.add("wrong");$$(".answer").forEach(function(x){if(decodeURIComponent(x.dataset.a)===state.q.correct)x.classList.add("correct")});
    if(state.q.f)progress.review[formKey(state.q.v,state.q.f)]=1;
    $("#feedback").textContent="Answer: "+state.q.correct+". "+(state.q.extra||"");
  }
  $$(".answer").forEach(function(x){x.disabled=true});$("#nextBtn").disabled=false;save();score();
}
function score(){var done=state.count-(state.answered?0:1);$("#score").textContent="This session: "+state.correct+"/"+Math.max(0,done)}
function updateProgress(){var m=Math.min(30,Object.keys(progress.mastered).length);$("#mastered").textContent=m;$("#bar").style.width=(m/30*100)+"%";$("#progressLabel").textContent=m+" of 30 conjugation forms reinforced"}
function dl(name,text,type){var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:type||"text/plain"}));a.download=name;a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},500)}
function csv(){
  var rows=["verb,meaning,person,form"];
  LESSON.verbs.forEach(function(v){v.forms.forEach(function(f){rows.push([v.inf,v.en,f[0],f[1]].map(function(x){return '"'+String(x).replaceAll('"','""')+'"'}).join(","))})});
  dl("schritt-fuer-schritt-vol-3-modal-verbs.csv",rows.join("\n"),"text/csv");
}
function anki(){
  var rows=[];LESSON.verbs.forEach(function(v){v.forms.forEach(function(f){rows.push(f[0]+" "+v.inf+"\t"+f[0]+" "+f[1]+"\t"+v.en)})});
  dl("schritt-fuer-schritt-vol-3-modal-verbs-anki.tsv",rows.join("\n"),"text/tab-separated-values");
}
var swipeStartX=0,swipeStartY=0,suppress=false;
$("#flashcard").onclick=function(){if(suppress)return;var on=this.classList.toggle("flipped");this.setAttribute("aria-pressed",on?"true":"false")};
$("#flashcard").addEventListener("touchstart",function(e){if(e.touches&&e.touches.length){swipeStartX=e.touches[0].clientX;swipeStartY=e.touches[0].clientY}},{passive:true});
$("#flashcard").addEventListener("touchend",function(e){if(!e.changedTouches||!e.changedTouches.length)return;var dx=e.changedTouches[0].clientX-swipeStartX,dy=e.changedTouches[0].clientY-swipeStartY;if(Math.abs(dx)<50||Math.abs(dx)<=Math.abs(dy)*1.15)return;suppress=true;dx<0?nextCard():prevCard();setTimeout(function(){suppress=false},250)},{passive:true});
$("#cardVerbFilter").onchange=resetCardPool;
$("#cardDirection").onchange=function(){state.cardDirection=this.value;renderCard()};
$("#shuffleCards").onclick=shuffleCards;$("#prevCard").onclick=prevCard;$("#nextCard").onclick=nextCard;
$("#reviewCard").onclick=function(){markCard("review")};$("#knownCard").onclick=function(){markCard("known")};
$("#speakCard").onclick=function(){var c=currentCard();speakGerman(c.f[0]+" "+c.f[1])};
$("#nextBtn").onclick=nextQuestion;$("#csvBtn").onclick=csv;$("#ankiBtn").onclick=anki;$("#printBtn").onclick=function(){window.print()};
$("#resetBtn").onclick=function(){if(confirm("Reset your Vol. 3 progress on this device?")){progress={mastered:{},review:{},attempts:0,correct:0};save();resetCardPool()}};
document.addEventListener("click",function(e){var b=e.target.closest(".speak-control");if(!b)return;speakGerman(decodeURIComponent(b.dataset.speak))});
document.addEventListener("keydown",function(e){
  if(["SELECT","INPUT","TEXTAREA"].indexOf(document.activeElement.tagName)>=0)return;
  if(e.key===" "){e.preventDefault();$("#flashcard").click()}
  if(e.key==="ArrowRight")nextCard();if(e.key==="ArrowLeft")prevCard();if(e.key==="1")markCard("review");if(e.key==="2")markCard("known");
});
renderVerbs();renderLesson();renderTabs();resetCardPool();nextQuestion();updateProgress();
})();