const { BeforeAll, After, AfterAll, Status } = require("cucumber");
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as fs from "fs";
import { browser } from "protractor";
import { config } from "../../protractor.config";

BeforeAll({ timeout: 100 * 1000 }, async () => {
    await browser.get(config.baseUrl);
    chai.use(chaiAsPromised);
});

After(async function (scenario) {
    if (scenario.result.status === Status.FAILED) {
        // screenShot is a base-64 encoded PNG
        const screenShot = await browser.takeScreenshot();
        this.attach(screenShot, "image/png");
    }
});

AfterAll({ timeout: 100 * 1000 }, async () => {
    await browser.quit();
});
