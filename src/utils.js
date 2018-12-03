export const downloadFile = (data, filename, type) => {
  const file = new Blob([data], { type });
  const a = document.createElement('a');
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
};

export const readFile = (file, cb) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    cb(e.target.result);
  };
  reader.readAsText(file, 'UTF-8');
};

export const getSimpleDateTime = () => {
  const d = new Date();
  return `${('00' + (d.getMonth() + 1)).slice(-2)}-${('00' + d.getDate()).slice(-2)}-${('00' + d.getHours()).slice(-2)}-${('00' + d.getMinutes()).slice(-2)}-${('00' + d.getSeconds()).slice(-2)}`;
}
