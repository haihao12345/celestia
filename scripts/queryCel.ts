import puppeteer from "puppeteer";
import sleep from "../lib/sleep";
import { getDir } from "../lib/getDir";
import * as fs from "fs";

const dirName = "../account";

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"],
  });
  const browserProcess = browser.process();
  let all: string[] = [];
  const writePath = getDir(dirName, "writeResult.txt");
  const queryPath = getDir(dirName, "needQuery.txt");
  const result = fs.readFileSync(queryPath, "utf8");
  all = result.split("\n");
  for (let s of all) {
    s = s.replace(/\t/g, "\t").replace(/\r/g, "\r");
    s = s.replace(/\n/g, "");
    console.log(s);

    let end = false;

    const page = await browser.newPage();
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);
    await page.setRequestInterception(true);
    // 请求
    page.on("request", (request) => {
      request.continue();
    });
    // 监听网络响应
    page.on("response", async (response) => {
      try {
        if (response.url().includes("airdrop")) {
          fs.appendFileSync(writePath, "查询地址" + s + "\n");
          const result = await response.json();
          result[0].description = "";
          result[1].description = "";
          result[2].description = "";
          result[3].description = "";
          fs.appendFileSync(writePath, JSON.stringify(result[0]) + "\n");
          fs.appendFileSync(writePath, JSON.stringify(result[1]) + "\n");
          fs.appendFileSync(writePath, JSON.stringify(result[2]) + "\n");
          fs.appendFileSync(writePath, JSON.stringify(result[3]) + "\n");
          fs.appendFileSync(writePath, "查询地址" + s + "\n");
          end = true;
        }
      } catch (error) {
        console.log(error);
      }
    });
    // 打开查询网站
    await page.goto(
      "https://genesis.celestia.org/?code=e4277861b5f9f0197768&state=%2F"
    );
    // 查找输入框
    const walletAddressInput = await page.$("#wallet_address");
    if (walletAddressInput) {
      // 使用 type 方法输入值 这里的值需要数组迭代一下
      await walletAddressInput.type(s);
      const buttonSelector = "button"; // 可以根据需要更改选择器
      const buttonText = "Check eligibility"; // 要查找的按钮文本内容
      const button = await page.evaluate(
        (selector, text) => {
          const buttons = Array.from(document.querySelectorAll(selector));
          return buttons.find((button) => button.textContent.includes(text));
        },
        buttonSelector,
        buttonText
      );
      if (button) {
        // 如果找到按钮，则点击它
        await button.click();
      }
    }
    while (!end) {
      await sleep(5 * 1000);
    }
    await page.close();
  }
})();
