export default function downloadFile(blob, fileName) {
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';

  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}
