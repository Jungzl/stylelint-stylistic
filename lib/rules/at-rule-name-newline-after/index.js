import { createPlugin, utils, rules } from 'stylelint'

const { ruleMessages, validateOptions, whitespaceChecker } = utils
const { atRuleNameSpaceChecker } = rules

const ruleName = 'stylistic/at-rule-name-newline-after'

const messages = ruleMessages(ruleName, {
  expectedAfter: (name) => `Expected newline after at-rule name "${name}"`,
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/at-rule-name-newline-after',
}

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
  const checker = whitespaceChecker('newline', primary, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: ['always', 'always-multi-line'],
    })

    if (!validOptions) {
      return
    }

    atRuleNameSpaceChecker({
      root,
      result,
      locationChecker: checker.afterOneOnly,
      checkedRuleName: ruleName,
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
export default { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
