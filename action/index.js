// packages
import core from '@actions/core'
import github from '@actions/github'

// modules
import main from './lib/index.js'

// exit early
if (github.context.eventName !== 'workflow_run') {
  core.error('action triggered outside of a workflow_run')
  process.exit(1)
}

// parse inputs
const inputs = {
  token: core.getInput('github-token', { required: true }),
  delay: core.getInput('delay', { required: true }),
  timeout: core.getInput('timeout', { required: true })
}

// error handler
function errorHandler ({ message, stack, request }) {
  core.error(`${message}\n${stack}`)

  // debugging for API calls
  if (request) {
    const { method, url, body, headers } = request
    core.debug(`${method} ${url}\n\n${inspect(headers)}\n\n${inspect(body)}`)
  }

  process.exit(1)
}

// catch errors and exit
process.on('unhandledRejection', errorHandler)
process.on('uncaughtException', errorHandler)

await main(inputs)
