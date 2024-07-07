// import './index'
import '../css/style.css'

// jsをテキストとして取得
// github pagesではbase pathが変わることを考慮している TODO: 環境変数にしたい
const fileUrls = [
  "js/vendor/minified/copyLinkUI.js",
].map(path => `${window.location.pathname}${path}`);

async function applyScript(fileResponse: Awaited<string>, selector: string) {
  const elList = document.querySelectorAll(selector) as NodeListOf<HTMLAnchorElement>;
  elList.forEach(el => {
    el.href = `javascript:${fileResponse}void(0);`
    el.classList.remove('hidden')
  })
}

Promise.all(fileUrls.map(url =>
  fetch(url).then(response => response.text())
)).then(async responses => {
  await applyScript(responses[0], '.script-button');
}).catch(error => {
  console.error('ファイルを読み込めませんでした。', error);
});
