// test_schedule.js
const { Builder, By, until, logging } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');

describe("Schedule Test - Create & Update", function() {
  let driver;
  
  // 全体のタイムアウト（必要に応じて調整）
  this.timeout(30000);

  // -----------------------------
  // ブラウザセッションの生成
  // -----------------------------
  before(async function() {
    const options = new chrome.Options();
    const prefs = new logging.Preferences();
    prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
    options.setLoggingPrefs(prefs);
    
    driver = await new Builder()
      .usingServer('http://selenium:4444/wd/hub')
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  // -----------------------------
  // テスト終了後にセッションを終了
  // -----------------------------
  after(async function() {
    await driver.quit();
  });

  // ====================================================
  // Schedule Create Test (test_schedule_create.js の内容)
  // ====================================================
  describe("Schedule Create Test", function() {
    it("登録画面を表示し、スケジュールを登録できること", async function() {
      // フロントエンドのURLにアクセス
      await driver.get('http://front:8080/');

      // .namakemonoクラスの要素が表示されるまで待機
      await driver.wait(until.elementLocated(By.css('.namakemono')), 10000);

      // .namakemonoクラスの画像をクリック
      const namakemonoImg = await driver.findElement(By.css('.namakemono'));
      await namakemonoImg.click();

      // 画面遷移待機：URL に /taskDetail が含まれるのを待つ
      await driver.wait(until.urlContains('/taskDetail'), 10000);
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('/taskDetail');

      // ---- タスク区分選択 (deadline) ----
      const vSelectFieldInput = await driver.findElement(By.css('.v-select .v-field__input'));
      await vSelectFieldInput.click();

      // ドロップダウンが表示されるまで待機し、"締切" を選択
      const deadlineItem = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class,'v-list-item') and contains(., '締切')]")),
        5000
      );
      await driver.wait(until.elementIsVisible(deadlineItem), 5000);
      await driver.executeScript("arguments[0].click();", deadlineItem);

      // 「締切」をクリック後、再描画されるフォームの待機
      await driver.sleep(3000);
      
      // ---- 締切日の入力 ----
      const dateInput = await driver.findElement(By.css('input[type="date"]'));
      await dateInput.clear();
      await driver.executeScript(`
        arguments[0].value = '2025-12-23';
        arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
        arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
      `, dateInput);

      // ---- タイトル入力 ----
      const textInputs = await driver.findElements(By.css('input[type="text"]'));
      await textInputs[0].sendKeys("自動テスト");

      // ---- 内容の入力 (現在時刻) ----
      const now = new Date().toLocaleString();
      const textarea = await driver.findElement(By.css('textarea'));
      await textarea.sendKeys(now);

      // ---- 登録ボタンのクリック ----
      const registerButton = await driver.findElement(By.xpath("//button[contains(., '登録')]"));
      await registerButton.click();

      // 登録後の確認: 登録ボタンが非表示になり、更新ボタンが表示される
      await driver.wait(
        until.elementIsNotVisible(registerButton),
        10000,
        "登録後も '登録' ボタンが非表示になりませんでした"
      );
      const updateButton = await driver.findElement(By.xpath("//button[contains(., '更新')]"));
      expect(await updateButton.isDisplayed()).to.be.true;

      // ブラウザコンソールログの出力（任意）
      const browserLogs = await driver.manage().logs().get(logging.Type.BROWSER);
      browserLogs.forEach(log => {
        console.log(`[Browser Console] ${log.level.name}: ${log.message}`);
      });
    });
  });

  // ====================================================
  // Schedule Update Test (test_schedule_update.js の内容)
  // ====================================================
  describe("Schedule Update Test", function() {
    it("リスト画面に遷移、スケジュールを選択して詳細画面を表示して更新できること", async function() {
      // 1) トップページ (カレンダー画面) にアクセス
      //await driver.get('http://front:8080/');

      // 2) "List" リンクをクリックして一覧画面に遷移
      const listLink = await driver.findElement(By.linkText('List'));
      await listLink.click();

      // 3) URL が /list を含むまで待機
      await driver.wait(until.urlContains('/list'), 10000);
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('/list');

      // 4) 一覧画面の1行目のタイトルリンクをクリックして詳細画面に遷移
      // ※ テーブルの描画を待機
      await driver.wait(
        until.elementLocated(By.xpath("//table/tbody/tr[1]/td[2]//a")),
        10000
      );
      const firstRowTitleLink = await driver.findElement(By.xpath("//table/tbody/tr[1]/td[2]//a"));
      await firstRowTitleLink.click();

      // 5) 詳細画面 (URL に /taskDetail が含まれる) への遷移待機
      await driver.wait(until.urlContains('/taskDetail'), 10000);

      // 6) タイトルを「変更後のタイトルです」に変更
      const titleInput = await driver.findElement(By.css('input[type="text"]'));
      await driver.executeScript("arguments[0].value = '';", titleInput);
      await driver.executeScript("arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", titleInput);
      await titleInput.sendKeys("変更後のタイトルです");

      // 7) 完了フラグをチェック (チェックされていなければクリック)
      const completeCheckbox = await driver.findElement(
        By.xpath("//label[contains(., '完了フラグ')]/preceding-sibling::div//input[@type='checkbox']")
      );
      if (!(await completeCheckbox.isSelected())) {
        await completeCheckbox.click();
      }

      // 8) 更新ボタンをクリック
      const updateButton = await driver.findElement(By.xpath("//button[contains(., '更新')]"));
      await updateButton.click();

      // ブラウザコンソールログの出力
      const browserLogs = await driver.manage().logs().get(logging.Type.BROWSER);
      browserLogs.forEach(log => {
        console.log(`[Browser Console] ${log.level.name}: ${log.message}`);
      });
    });
  });
  // ====================================================
  // Schedule Delete Test (追加)
  // ====================================================
  describe("Schedule Delete Test", function() {
    it("削除ボタンをクリックし、ポップアップでOKを押下してスケジュールを削除できること", async function() {
      // 1) 詳細画面で削除ボタンを取得（TaskDetail.vue で v-btn "削除"）
      const deleteButton = await driver.findElement(By.xpath("//button[contains(., '削除')]"));
      
      // 2) 削除ボタンをクリック
      await deleteButton.click();

      // 3) ポップアップが表示されるまで待機（confirm ダイアログ）
      await driver.wait(until.alertIsPresent(), 5000);

      // 4) アラートを取得して "OK" をクリック（受け入れる）
      const alert = await driver.switchTo().alert();
      await alert.accept();

      // ブラウザコンソールログの出力
      const browserLogs = await driver.manage().logs().get(logging.Type.BROWSER);
      browserLogs.forEach(log => {
        console.log(`[Browser Console] ${log.level.name}: ${log.message}`);
      });
    });
  });
});
