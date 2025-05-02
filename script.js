
const fileInput = document.getElementById('fileInput');
const gridContainer = document.getElementById('gridContainer');
const downloadBtn = document.getElementById('downloadBtn');

let images = [];

fileInput.addEventListener('change', handleFiles);

function handleFiles() {
  const files = Array.from(fileInput.files);
  
  const remainingSlots = 50 - images.length;
  if (remainingSlots <= 0) {
    alert('Maximum de 50 logos atteint.');
    return;
  }
  const validFiles = files.slice(0, remainingSlots);


  validFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'grid-item';
      img.draggable = true;

      img.addEventListener('dragstart', handleDragStart);
      img.addEventListener('dragover', e => e.preventDefault());
      img.addEventListener('drop', handleDrop);

      gridContainer.appendChild(img);
      images.push(img);
      updateGridLayout();
    };
    reader.readAsDataURL(file);
  });
}

function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', images.indexOf(e.target));
}

function handleDrop(e) {
  e.preventDefault();
  const draggedIndex = e.dataTransfer.getData('text/plain');
  const targetIndex = images.indexOf(e.target);

  if (draggedIndex === targetIndex) return;

  const draggedImage = images[draggedIndex];
  images.splice(draggedIndex, 1);
  images.splice(targetIndex, 0, draggedImage);

  refreshGrid();
}

function refreshGrid() {
  gridContainer.innerHTML = '';
  images.forEach(img => gridContainer.appendChild(img));
  updateGridLayout();
}

function updateGridLayout() {
  const count = images.length;
  const cols = Math.ceil(Math.sqrt(count * 16 / 9));
  const rows = Math.ceil(count / cols);
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
}

downloadBtn.addEventListener('click', () => {
  html2canvas(gridContainer).then(canvas => {
    const link = document.createElement('a');
    link.download = 'grillito.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});

document.getElementById('toggleDarkMode').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
