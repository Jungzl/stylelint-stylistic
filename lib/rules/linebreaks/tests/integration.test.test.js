import { lint } from 'stylelint'

describe('integration tests for linebrakes', () => {
  it('should not be an error (issues/3635).', async () => {
    const { report } = await lint({
      code: 'a{color:red;}',
      config: {
        rules: {
          'linebreaks': 'unix',
          'block-closing-brace-newline-before': 'always',
        },
      },
      fix: true,
    })

    expect(report).toBe('a{color:red;\n}')
  })
})
