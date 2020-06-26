const app = require("../src/client/js/app");

test("test return defined", () => {
    expect(app.updateUI).toBeDefined();
});