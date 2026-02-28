document.addEventListener("DOMContentLoaded",()=>{

const btn=document.getElementById("search-btn");
const input=document.getElementById("user-input");
const stats=document.querySelector(".stats-container");
const cards=document.querySelector(".stats-cards");

const easyL=document.getElementById("easy-label");
const medL=document.getElementById("medium-label");
const hardL=document.getElementById("hard-label");

function valid(name){
  if(name.trim()===""){
    alert("Username empty hai");
    return false;
  }
  const r=/^[a-zA-Z0-9_-]{1,15}$/;
  if(!r.test(name)){
    alert("Invalid username");
    return false;
  }
  return true;
}

function update(label,solved,total){
  label.textContent=`${solved}/${total}`;
}

function show(data){

  const all=data.data.allQuestionsCount;
  const solved=data.data.matchedUser.submitStats.acSubmissionNum;
  const subs=data.data.matchedUser.submitStats.totalSubmissionNum;

  update(easyL,solved[1].count,all[1].count);
  update(medL,solved[2].count,all[2].count);
  update(hardL,solved[3].count,all[3].count);

  const arr=[
    ["Total Submissions",subs[0].submissions],
    ["Easy Submissions",subs[1].submissions],
    ["Medium Submissions",subs[2].submissions],
    ["Hard Submissions",subs[3].submissions]
  ];

  cards.innerHTML=arr.map(x=>`
    <div class="card">
      <h4>${x[0]}</h4>
      <p>${x[1]}</p>
    </div>`).join("");

  stats.classList.remove("hidden");
}

async function fetchUser(name){

  btn.textContent="Searching...";
  btn.disabled=true;

  try{
    const res=await fetch("https://corsproxy.io/?https://leetcode.com/graphql/",{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({
        query:`query($username:String!){
          allQuestionsCount{difficulty count}
          matchedUser(username:$username){
            submitStats{
              acSubmissionNum{difficulty count}
              totalSubmissionNum{difficulty submissions}
            }
          }
        }`,
        variables:{username:name}
      })
    });

    if(!res.ok) throw new Error("User not found");

    const data=await res.json();
    if(!data.data.matchedUser){
      alert("Invalid username");
      return;
    }

    show(data);

  }catch(e){
    alert("Error fetching user");
  }
  finally{
    btn.textContent="Search";
    btn.disabled=false;
  }
}

btn.addEventListener("click",()=>{
  const name=input.value;
  if(valid(name)) fetchUser(name);
  fetchUser("lee215");
});

});