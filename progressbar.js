// progressbar
const form = document.querySelector("form"),
fileInput = document.querySelector(".file-input"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area");
form.addEventListener("click", () =>{
  fileInput.click();
});
fileInput.onchange = ({target})=>{
  uploadFile(target.files[0].name);
}
function uploadFile(name){
  let xhr = new XMLHttpRequest();
  let fileSize = 0;
  xhr.addEventListener('load', function (){
    form.reset()
    if(xhr.status == 200) {
      progressArea.innerHTML = "";
      let uploadedHTML = `
      <li class="d-flex flex-wrap mb-2">
        <div class="content upload">
          <i class="fa fa-file-alt me-3"></i>
          <div class="details">
            <span class="name">${name} • اتمام بارگذاری</span>
            <span class="size">${fileSize}</span>
          </div>
        </div>
        <i class="fa fa-check"></i>
      </li>`;
      uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
      return true;
    }
    progressArea.innerHTML = "";
    let uploadedHTML = `
    <li class="d-flex flex-wrap mb-2">
      <div class="content upload">
        <i class="fa fa-file-alt  me-3"></i>
        <div class="details">
          <span class="name">${name} • خطا در بارگذاری</span>
          <span class="size">${fileSize}</span>
        </div>
      </div>
      <i class="fa fa-times"></i>
    </li>`;
    uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
    ajax_error(JSON.parse(xhr.response), xhr.status);
    return false
  });
  xhr.open("POST", `your url for requesting to upload`);
  xhr.upload.addEventListener("progress", ({loaded, total}) =>{
    let fileLoaded = Math.floor((loaded / total) * 100);
    let fileTotal = Math.floor(total / 1000);
    (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024*1024)).toFixed(2) + " MB";
    let progressHTML = `
    <li class="d-flex flex-wrap mb-2">
      <i class="fa fa-file-alt  me-3"></i>
      <div class="content">
        <div class="details">
          <span class="name">${name} • در حال بارگذاری</span>
          <span class="percent">${fileLoaded}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress" style="width: ${fileLoaded}%"></div>
        </div>
      </div>
    </li>`;
    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;
    if(loaded == total){
      uploadedArea.classList.remove("onprogress");
    }
  });
  let formData = new FormData();
  const file = $("#file").get(0).files[0];
  formData.append("file", file);

  xhr.setRequestHeader("X-CSRF-TOKEN", $('meta[name="csrf-token"]').attr("content"));
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send(formData);
}
// end progressbar
