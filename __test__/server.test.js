const server = require("../src/server/index");

test("test return defined", () => {
    expect(server.getInformations).toBeDefined();
});