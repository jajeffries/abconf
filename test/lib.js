const assert = require("assert");

const tests = [
  {
    description: "A test",
    config: {
      cookieName: "test_cookie",
      variations: {
        control: "/",
        cookie_value1: "/var1",
        cookie_value2: "/var2"
      }
    },
    expectedOutput: `<rule name="test_cookie - 0" stopProcessing="true">
                      <match url="^$|^var1$|^var2$" />
                      <conditions>
                          <add input="{HTTP_COOKIE}" pattern="test_cookie=control" />
                      </conditions>
                      <action type="redirect" redirectType="temporary" url="/" />
                  </rule>,<rule name="test_cookie - 1" stopProcessing="true">
                      <match url="^$|^var1$|^var2$" />
                      <conditions>
                          <add input="{HTTP_COOKIE}" pattern="test_cookie=cookie_value1" />
                      </conditions>
                      <action type="redirect" redirectType="temporary" url="/var1" />
                  </rule>,<rule name="test_cookie - 2" stopProcessing="true">
                      <match url="^$|^var1$|^var2$" />
                      <conditions>
                          <add input="{HTTP_COOKIE}" pattern="test_cookie=cookie_value2" />
                      </conditions>
                      <action type="redirect" redirectType="temporary" url="/var2" />
                  </rule>`
  }
];

tests.forEach((test) => {
  describe(test.description, () => {
    it("generates config", () => {
      abconf(test.config, (output) => {
        assert.equal(output, test.expectedOutput)
      }, (err) => {
        assert.fail(err);
      });
    });
  });
});


function abconf(config, success, error) {
  const testUrls = Object.values(config.variations);
  const testPattern = "^$|^var1$|^var2$";
  const rules = [];
  Object.keys(config.variations).forEach((variation, index) => {
    const redirectUrl = config.variations[variation];
    const output = `<rule name="${config.cookieName} - ${index}" stopProcessing="true">
                      <match url="${testPattern}" />
                      <conditions>
                          <add input="{HTTP_COOKIE}" pattern="${config.cookieName}=${variation}" />
                      </conditions>
                      <action type="redirect" redirectType="temporary" url="${redirectUrl}" />
                  </rule>`;
    rules.push(output);
  });
  success(rules.toString());
}