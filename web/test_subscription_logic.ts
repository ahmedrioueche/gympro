import { getPlanChangeType } from "./src/utils/subscription.util";

const runTests = () => {
  const tests = [
    {
      name: "Pro Monthly -> Starter Yearly (Cycle Upgrade + Level Downgrade) -> Expect Switch Up",
      args: ["pro", "monthly", "starter", "yearly"],
      expected: "switch_up",
    },
    {
      name: "Pro Yearly -> Starter Monthly (Cycle Downgrade + Level Downgrade) -> Expect Switch Down",
      args: ["pro", "yearly", "starter", "monthly"],
      expected: "switch_down",
    },
    {
      name: "Starter Monthly -> Pro Monthly (Same Cycle + Level Upgrade) -> Expect Upgrade",
      args: ["starter", "monthly", "pro", "monthly"],
      expected: "upgrade",
    },
    {
      name: "Pro Monthly -> Starter Monthly (Same Cycle + Level Downgrade) -> Expect Downgrade",
      args: ["pro", "monthly", "starter", "monthly"],
      expected: "downgrade",
    },
    {
      name: "Starter Monthly -> Starter Yearly (Same Level + Cycle Upgrade) -> Expect Switch Up",
      args: ["starter", "monthly", "starter", "yearly"],
      expected: "switch_up",
    },
  ];

  let passed = 0;
  tests.forEach((test) => {
    // @ts-ignore
    const result = getPlanChangeType(...test.args);
    if (result === test.expected) {
      console.log(`PASS: ${test.name}`);
      passed++;
    } else {
      console.error(
        `FAIL: ${test.name} - Expected ${test.expected}, got ${result}`
      );
    }
  });

  console.log(`\n${passed}/${tests.length} tests passed.`);
};

runTests();
