const searchInFile = (data) => {
  return new Promise((resolve, reject) => {
    const pattern = new RegExp(data.search.findString, "g");
    let count = 0;
    const out = data.search.text.replace(pattern, () => {
      count++;
      return `<span style="color: red">${data.search.findString}</span>`;
    });
    resolve({
      counter: `<p style="color: green">Найдено совпадений: ${count}</p>`,
      output: out,
    });
  });
};

export { searchInFile };
