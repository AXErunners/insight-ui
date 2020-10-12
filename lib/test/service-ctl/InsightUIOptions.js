const fs = require('fs');
const os = require('os');
const path = require('path');

const NodeJsServiceOptions = require('@axerunners/dp-services-ctl/lib/services/node/NodeJsServiceOptions');

class InsightUIOptions extends NodeJsServiceOptions {
  static setDefaultCustomOptions(options) {
    InsightUIOptions.defaultCustomOptions = options;
  }

  mergeWithDefaultOptions(...customOptions) {
    const port = this.getRandomPort(20002, 29998);

    const defaultServiceOptions = {
      config: {
        port,
        network: 'testnet',
        services: [
          'axed',
          '@axerunners/insight-api',
          '@axerunners/insight-ui',
          'web',
        ],
      },
      cacheNodeModules: false,
    };

    const configFile = this.getConfigPath();

    const defaultContainerOptions = {
      image: 'axerunners/insight',
      network: {
        name: 'axe_test_network',
        driver: 'bridge',
      },
      ports: [
        `${port}:${port}`,
      ],
      cmd: [
        '/insight/bin/axecore-node',
        'start',
      ],
      volumes: [...InsightUIOptions.defaultCustomOptions.container.volumes,
        `${configFile}:/insight/axecore-node.json`,
      ],
    };

    const defaultOptions = defaultServiceOptions;
    defaultOptions.container = defaultContainerOptions;

    const options = super.mergeWithDefaultOptions(
      defaultOptions,
      InsightUIOptions.defaultCustomOptions,
      ...customOptions,
    );

    this.saveConfig(configFile, options);

    return options;
  }

  /**
   * Get Insight UI port
   *
   * @returns {number}
   */
  getUiPort() {
    return this.options.config.port;
  }

  // noinspection JSMethodCanBeStatic
  getConfigPath() {
    let tempDir = os.tmpdir();
    if (os.platform() === 'darwin') {
      // Default temp dir on mac is like '/var/folders/...'
      // docker doesn't allow to share files there without changing 'File sharing' settings
      tempDir = '/tmp';
    }
    const tmpPath = fs.mkdtempSync(path.join(tempDir, 'js-evo-ctl-insight-'));
    return path.join(tmpPath, 'bitcore-node-axe.json');
  }

  // noinspection JSMethodCanBeStatic
  saveConfig(configPath, options) {
    const { config } = options;
    const data = JSON.stringify(config);
    fs.writeFileSync(configPath, data);
  }
}

InsightUIOptions.defaultCustomOptions = {};

module.exports = InsightUIOptions;
