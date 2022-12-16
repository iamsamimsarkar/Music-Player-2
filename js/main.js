//eruda.init();
let aud = $("#aud")[0];
function checkMode(){
  let darkMode = localStorage.getItem('darkMode');
  $("#darkMode").val(darkMode);
  if(darkMode == "true"){
    $("#darkMode")[0].checked = true;
    $("body").addClass('text-bg-dark');
    $(".modal-content").addClass('text-bg-dark');
  }
  else{
    $("#darkMode")[0].checked = false;
  $("body").removeClass('text-bg-dark')
  $(".modal-content").removeClass('text-bg-dark')
  }
  }

checkMode();
$("#darkMode").on('change',function(){
  if($(this).val() == "true"){
    $(this).val('false')
  }
  else{
    $(this).val('true')
  }
  localStorage.setItem('darkMode',$(this).val());
  checkMode();
})
function func(){
  localforage.getItem("music")
  .then((data)=>{
    taskObj = data;
    let html = "";
    taskObj.forEach((item,num)=>{
      html += `
      <li class="list-group-item d-flex justify-content-between align-items-center" style="word-break:break-all"><span onclick="selectMusic('${num+1}')">${item.name.slice(0,item.name.lastIndexOf("."))}</span> <button class="btn btn-sm btn-danger" onclick="dltMusic('${num}')"><i class="fas fa-trash-alt"></i></button></li>
      `
    })
    $(".list-group").html(html);
  })
}
func()
$("#myForm").on('submit',function(frm){
  frm.preventDefault();
  localforage.getItem('music')
  .then((datas)=>{
    if(datas == "" || datas == null){
      musicObj = [];
    }
    else{
      musicObj = datas;
    }
    let fi = $("#file")[0].files;
    for(let i = 0; i < fi.length; i++){
      musicObj.push(fi[i]);
    }
    localforage.setItem("music",musicObj)
    .then((a)=>{
      $('#myForm')[0].reset();
      func()
    })
  })
})
let index = 0;
function show() {
  localforage.getItem("music")
  .then((data)=>{
    musicName = data[index].name;
    musicName = musicName.slice(0,musicName.lastIndexOf("."));
    url = URL.createObjectURL(data[index]);
    if(musicName.length > 27){
      musicName = musicName.slice(0,27);
    }
  $(".music-title").text(musicName)
  aud.src = URL.createObjectURL(data[index]);
  })
}
show();
$("#music-control").on('click',function(){
  aud.paused?aud.play():aud.pause();
})
function musicNext(){
  index = (index + 1) % taskObj.length;
  show();
  $("#music-control")[0].click();
  setTimeout(function() {
    $("#music-control")[0].click();
  }, 100);
}
$("#musicPrev").on('click',function(){
  index = (index - 1 + taskObj.length) % taskObj.length;
  show();
  $("#music-control")[0].click();
  setTimeout(function() {
    $("#music-control")[0].click();
  }, 100);
})
$("#aud").on('play',function(){
  $("#music-control i").addClass('fa-pause-circle');
  $("#music-control i").removeClass('fa-play-circle');
})
$("#aud").on('pause',function(){
  $("#music-control i").removeClass('fa-pause-circle');
  $("#music-control i").addClass('fa-play-circle');
})
aud.onended = () => {
  musicNext();
}
aud.onloadedmetadata = () => {
  let li = document.querySelectorAll(".list-group li");
  for(let i = 0; i < li.length; i++){
    li[i].classList.remove('active');
  }
  li[index].classList.add('active');
  setTimeout(function() {
    document.title = musicName;
  }, 100);
  let m_dur = Math.floor(aud.duration / 60);
  m_dur = m_dur<10?"0"+m_dur:m_dur;
  let s_dur = Math.floor(aud.duration % 60);
  s_dur = s_dur<10?"0"+s_dur:s_dur;
  $("#music-dur").text(m_dur+":"+s_dur);
}
aud.ontimeupdate = () => {
  let m_time = Math.floor(aud.currentTime / 60);
  m_time = m_time<10?"0"+m_time:m_time;
  let s_time = Math.floor(aud.currentTime % 60);
  s_time = s_time<10?"0"+s_time:s_time;
  $("#music-time").text(m_time+":"+s_time);
  $(".progress-bar")[0].style.width = (aud.currentTime / aud.duration) * 100 + "%"
}
$(".progress").on("click",function(e){
  let prog = $(".progress")[0];
  aud.currentTime = (e.offsetX/prog.offsetWidth)*aud.duration;
})

function dltMusic(num) {
  if(confirm("Are you sure?")){
    taskObj.splice(num,1);
    localforage.setItem("music",taskObj)
    .then(()=>{
      func();
      show();
    })
  }
}

function selectMusic(num){
  index = num-1;
  show();
  setTimeout(function() {
    aud.play();
  }, 100);
}
