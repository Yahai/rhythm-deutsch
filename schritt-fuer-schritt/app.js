(function(){
var VIDEO_ID="YMZONJcQjhY";
var LESSON={verbs:[
{inf:"machen",en:"to do / make",note:"regular",start:18.460,forms:[["ich","mache",21.980],["du","machst",22.600],["er / sie / es","macht",23.380],["wir","machen",26.020],["ihr","macht",27.100],["sie / Sie","machen",27.620]],examples:[["Ich mache das heute.","I’ll do that today.",30.360],["Was machst du?","What are you doing?",32.180]]},
{inf:"gehen",en:"to go",note:"regular present pattern",start:35.920,forms:[["ich","gehe",37.130],["du","gehst",38.180],["er / sie / es","geht",38.880],["wir","gehen",40.820],["ihr","geht",41.340],["sie / Sie","gehen",41.840]],examples:[["Ich gehe nach Hause.","I’m going home.",44.060],["Gehst du mit?","Are you coming along?",45.400]]},
{inf:"kommen",en:"to come",note:"regular",start:89.220,forms:[["ich","komme",90.520],["du","kommst",92.100],["er / sie / es","kommt",92.720],["wir","kommen",93.640],["ihr","kommt",94.320],["sie / Sie","kommen",94.900]],examples:[["Ich komme morgen.","I’m coming tomorrow.",95.880],["Kommst du auch?","Are you coming too?",97.080]]},
{inf:"haben",en:"to have",note:"irregular: hast / hat",start:100.660,forms:[["ich","habe",102.210],["du","hast",103.070],["er / sie / es","hat",103.240],["wir","haben",104.780],["ihr","habt",105.380],["sie / Sie","haben",105.920]],examples:[["Ich habe Zeit.","I have time.",107.220],["Hast du Zeit?","Do you have time?",108.220]]},
{inf:"sein",en:"to be",note:"highly irregular",start:111.280,forms:[["ich","bin",112.380],["du","bist",112.920],["er / sie / es","ist",113.560],["wir","sind",114.660],["ihr","seid",115.100],["sie / Sie","sind",115.820]],examples:[["Ich bin hier.","I’m here.",116.240],["Wir sind bereit.","We’re ready.",118.300]]}
]};
var modes={meaning:"Meaning",conjugation:"Conjugation",sentence:"Sentence completion",reverse:"Reverse recall",song:"Hear it in the song"};
var state={verb:0,mode:"conjugation",count:0,correct:0,answered:false,q:null,cardPool:[],cardIndex:0,cardDirection:"prompt-form"};
var key="rd-schritt-fuer-schritt-v4";
var progress;
try{progress=JSON.parse(localStorage.getItem(key)||'{"mastered":{},"review":{},"attempts":0,"correct":0}')}catch(e){progress={mastered:{},review:{},attempts:0,correct:0}}
if(!progress.mastered)progress.mastered={};if(!progress.review)progress.review={};
function $(s){return document.querySelector(s)}
function $$(s){return Array.prototype.slice.call(document.querySelectorAll(s))}
function fmt(t){var m=Math.floor(t/60),s=t-m*60;return m+":"+String(s.toFixed(2)).padStart(5,"0")}
function yurl(t){return "https://www.youtube.com/watch?v="+VIDEO_ID+"&t="+Math.max(0,Math.floor(t)-1)+"s"}
function hear(t,label){return '<a class="hear hear-song" href="'+yurl(t)+'" target="_blank" rel="noopener">▶ '+(label||"Hear in song")+" · "+fmt(t)+"</a>"}
function speakControl(text,label){return '<button type="button" class="hear hear-german speak-control" data-speak="'+encodeURIComponent(text)+'">🔊 '+(label||"Hear German")+'</button>'}
function audioPair(text,t,songLabel){return '<div class="audio-pair">'+speakControl(text,"Hear German")+hear(t,songLabel||"Hear in song")+'</div>'}
function save(){localStorage.setItem(key,JSON.stringify(progress));updateProgress()}
function formKey(v,f){return v.inf+":"+f[0]}
function allCards(){var out=[];LESSON.verbs.forEach(function(v,vi){v.forms.forEach(function(f,fi){out.push({id:out.length+1,vi:vi,fi:fi,v:v,f:f,key:formKey(v,f)})})});return out}
function exampleFor(c){return c.v.examples[c.fi%c.v.examples.length]}
function renderVerbs(){var g=$("#verbGrid");g.innerHTML=LESSON.verbs.map(function(v,i){return '<button class="verbchip '+(i===state.verb?"active":"")+'" data-i="'+i+'"><strong>'+v.inf+"</strong><span>"+v.en+"</span></button>"}).join("");$$(".verbchip").forEach(function(b){b.onclick=function(){state.verb=+b.dataset.i;renderVerbs();renderLesson()}})}
function renderLesson(){var v=LESSON.verbs[state.verb];$("#lesson").innerHTML='<div class="lessontop"><div><h3 class="verbtitle">'+v.inf+'</h3><div class="meaning">'+v.en+" · <strong>"+v.note+"</strong></div></div>"+audioPair(v.inf,v.start,"Hear section")+'</div><div class="tablewrap"><table class="conj"><thead><tr><th>Person</th><th>Präsens</th><th>Audio</th></tr></thead><tbody>'+v.forms.map(function(f){var spoken=f[0]+" "+f[1];return "<tr><td>"+f[0]+"</td><td>"+f[1]+"</td><td>"+audioPair(spoken,f[2],"Hear in song")+"</td></tr>"}).join("")+'</tbody></table></div><div class="examples">'+v.examples.map(function(x){return '<div class="example"><div class="de">'+x[0]+'</div><div class="en">'+x[1]+'</div><div class="example-audio">'+audioPair(x[0],x[2],"Hear in song")+"</div></div>"}).join("")+"</div>"}
function resetCardPool(){var filter=$("#cardVerbFilter").value;state.cardPool=allCards().filter(function(c){return filter==="all"||c.v.inf===filter});state.cardIndex=0;renderCard()}
function cardFrontBack(c){var dir=state.cardDirection;if(dir==="mixed")dir=c.id%2?"prompt-form":"form-prompt";if(dir==="prompt-form")return{kick:"Conjugate",front:c.f[0]+" + "+c.v.inf,back:c.f[0]+" "+c.f[1]};return{kick:"Identify",front:c.f[0]+" "+c.f[1],back:c.f[0]+" + "+c.v.inf}}
function currentCard(){return state.cardPool[state.cardIndex]||allCards()[0]}
function renderCard(){var c=currentCard(),fb=cardFrontBack(c),ex=exampleFor(c),card=$("#flashcard");card.classList.remove("flipped");card.setAttribute("aria-pressed","false");$("#frontNumber").textContent=$("#backNumber").textContent=String(c.id).padStart(2,"0");$("#frontKicker").textContent=fb.kick;$("#frontPrompt").textContent=fb.front;$("#backAnswer").textContent=fb.back;$("#cardExampleDe").textContent=ex[0];$("#cardExampleEn").textContent=ex[1];$("#cardPosition").textContent=(state.cardIndex+1)+" / "+state.cardPool.length;$("#cardContext").textContent=c.v.inf+" · "+c.v.note;$("#songCard").href=yurl(c.f[2])}
function nextCard(){state.cardIndex=(state.cardIndex+1)%state.cardPool.length;renderCard()}
function prevCard(){state.cardIndex=(state.cardIndex-1+state.cardPool.length)%state.cardPool.length;renderCard()}
function shuffleCards(){for(var i=state.cardPool.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),tmp=state.cardPool[i];state.cardPool[i]=state.cardPool[j];state.cardPool[j]=tmp}state.cardIndex=0;renderCard()}
function markCard(type){var c=currentCard();if(type==="known"){progress.mastered[c.key]=1;delete progress.review[c.key]}else{progress.review[c.key]=1;delete progress.mastered[c.key]}save();nextCard()}
function speakGerman(text){if(!("speechSynthesis" in window))return;window.speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(text);u.lang="de-DE";u.rate=.82;window.speechSynthesis.speak(u)}
function forms(){var a=[];LESSON.verbs.forEach(function(v){v.forms.forEach(function(f){a.push({verb:v.inf,en:v.en,person:f[0],form:f[1],t:f[2],key:formKey(v,f)})})});return a}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function shuffle(a){return a.slice().sort(function(){return Math.random()-.5})}
function question(){var all=forms(),v=pick(LESSON.verbs),f=pick(v.forms),q="",correct="",alts=[],play=0;
if(state.mode==="meaning"){q='What does “'+v.inf+'” mean?';correct=v.en;alts=LESSON.verbs.filter(function(x){return x.inf!==v.inf}).map(function(x){return x.en});f=null}
if(state.mode==="conjugation"){q=f[0]+" ____ ("+v.inf+")";correct=f[1];alts=all.filter(function(x){return x.form!==correct}).map(function(x){return x.form})}
if(state.mode==="sentence"){var ex=pick(v.examples),target=v.forms.find(function(x){return ex[0].toLowerCase().indexOf(x[1].toLowerCase())>-1})||f;f=target;q=ex[0].replace(new RegExp(target[1],"i"),"____");correct=target[1];alts=all.filter(function(x){return x.form!==correct}).map(function(x){return x.form})}
if(state.mode==="reverse"){q='“'+f[1]+'” belongs to which infinitive?';correct=v.inf;alts=LESSON.verbs.filter(function(x){return x.inf!==v.inf}).map(function(x){return x.inf})}
if(state.mode==="song"){q="At "+fmt(f[2])+", which form do you hear?";correct=f[1];alts=all.filter(function(x){return x.form!==correct}).map(function(x){return x.form});play=f[2]}
var unique=Array.from(new Set(alts));return{q:q,correct:correct,answers:shuffle([correct].concat(shuffle(unique).slice(0,3))),v:v,f:f,play:play}}
function renderTabs(){$("#tabs").innerHTML=Object.keys(modes).map(function(k){return '<button class="tab '+(k===state.mode?"active":"")+'" data-mode="'+k+'">'+modes[k]+"</button>"}).join("");$$(".tab").forEach(function(b){b.onclick=function(){state.mode=b.dataset.mode;renderTabs();nextQuestion()}})}
function nextQuestion(){state.answered=false;state.q=question();state.count++;$("#qMode").textContent=modes[state.mode];$("#qCount").textContent="Question "+state.count;$("#question").innerHTML=state.q.q+(state.q.play?'<div style="margin-top:16px">'+hear(state.q.play,"Play this phrase")+"</div>":"");$("#answers").innerHTML=state.q.answers.map(function(a){return '<button class="answer" data-a="'+encodeURIComponent(a)+'">'+a+"</button>"}).join("");$("#feedback").textContent="";$("#nextBtn").disabled=true;$$(".answer").forEach(function(b){b.onclick=function(){answerQuestion(b,decodeURIComponent(b.dataset.a))}});score()}
function answerQuestion(btn,a){if(state.answered)return;state.answered=true;progress.attempts++;var ok=a===state.q.correct;if(ok){state.correct++;progress.correct++;btn.classList.add("correct");if(state.q.f){progress.mastered[formKey(state.q.v,state.q.f)]=1;delete progress.review[formKey(state.q.v,state.q.f)]}$("#feedback").textContent="Correct. Keep the pattern moving."}else{btn.classList.add("wrong");$$(".answer").forEach(function(x){if(decodeURIComponent(x.dataset.a)===state.q.correct)x.classList.add("correct")});if(state.q.f){progress.review[formKey(state.q.v,state.q.f)]=1}$("#feedback").textContent="Answer: "+state.q.correct}$$(".answer").forEach(function(x){x.disabled=true});$("#nextBtn").disabled=false;save();score()}
function score(){var done=state.count-(state.answered?0:1);$("#score").textContent="This session: "+state.correct+"/"+Math.max(0,done)}
function updateProgress(){var m=Math.min(30,Object.keys(progress.mastered).length);$("#mastered").textContent=m;$("#bar").style.width=(m/30*100)+"%";$("#progressLabel").textContent=m+" of 30 conjugation forms reinforced"}
function dl(name,text,type){var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:type||"text/plain"}));a.download=name;a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},500)}
function csv(){var rows=["verb,meaning,person,form,timestamp,youtube"];LESSON.verbs.forEach(function(v){v.forms.forEach(function(f){rows.push([v.inf,v.en,f[0],f[1],fmt(f[2]),yurl(f[2])].map(function(x){return '"'+String(x).replaceAll('"','""')+'"'}).join(","))})});dl("schritt-fuer-schritt-vol-1.csv",rows.join("\n"),"text/csv")}
function anki(){var rows=[];LESSON.verbs.forEach(function(v){v.forms.forEach(function(f){rows.push(f[0]+" "+v.inf+"\t"+f[0]+" "+f[1]+"\t"+v.en+" · "+fmt(f[2]))})});dl("schritt-fuer-schritt-vol-1-anki.tsv",rows.join("\n"),"text/tab-separated-values")}
var swipeStartX=0,swipeStartY=0,suppressCardClick=false;
$("#flashcard").onclick=function(){if(suppressCardClick)return;var on=this.classList.toggle("flipped");this.setAttribute("aria-pressed",on?"true":"false")};
$("#flashcard").addEventListener("touchstart",function(e){if(!e.touches||!e.touches.length)return;swipeStartX=e.touches[0].clientX;swipeStartY=e.touches[0].clientY},{passive:true});
$("#flashcard").addEventListener("touchend",function(e){if(!e.changedTouches||!e.changedTouches.length)return;var dx=e.changedTouches[0].clientX-swipeStartX,dy=e.changedTouches[0].clientY-swipeStartY;if(Math.abs(dx)<50||Math.abs(dx)<=Math.abs(dy)*1.15)return;suppressCardClick=true;if(dx<0)nextCard();else prevCard();setTimeout(function(){suppressCardClick=false},250)},{passive:true});
$("#cardVerbFilter").onchange=resetCardPool;
$("#cardDirection").onchange=function(){state.cardDirection=this.value;renderCard()};
$("#shuffleCards").onclick=shuffleCards;
$("#nextCard").onclick=nextCard;
$("#prevCard").onclick=prevCard;
$("#knownCard").onclick=function(){markCard("known")};
$("#reviewCard").onclick=function(){markCard("review")};
$("#speakCard").onclick=function(){var c=currentCard();speakGerman(c.f[0]+" "+c.f[1])};
document.body.addEventListener("click",function(e){var b=e.target.closest(".speak-control");if(!b)return;speakGerman(decodeURIComponent(b.dataset.speak))});
$("#nextBtn").onclick=nextQuestion;
$("#csvBtn").onclick=csv;
$("#ankiBtn").onclick=anki;
$("#printBtn").onclick=function(){window.print()};
$("#resetBtn").onclick=function(){if(confirm("Reset local practice progress for this lesson?")){progress={mastered:{},review:{},attempts:0,correct:0};save()}};
document.addEventListener("keydown",function(e){if(document.activeElement&&/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName))return;if(e.code==="Space"){e.preventDefault();$("#flashcard").click()}else if(e.key==="ArrowRight"){nextCard()}else if(e.key==="ArrowLeft"){prevCard()}else if(e.key==="1"){markCard("review")}else if(e.key==="2"){markCard("known")}});
renderVerbs();
renderLesson();
state.cardPool=allCards();
renderCard();
renderTabs();
nextQuestion();
updateProgress();
})();