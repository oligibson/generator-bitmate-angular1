'use strict';

const bitmate = require('bitmate-generator');

module.exports = bitmate.Base.extend({
  prompting: {
    bitmate() {
      this.options.server = (this.options.server) ? this.options.server : 'none';
      this.options.client = 'angular1';
      return this.bitmatePrompts();
    },

    angularOptions() {
      // Can add more prompts that are angular specific here...
      this.option('router', {type: String, required: true});
      this.option('styling', {type: String, required: false});

      const prompts = [{
        when: !this.options.router,
        type: 'list',
        name: 'router',
        message: 'Would you like a router?',
        choices: [
          // {name: 'Angular Component Router (Angular 2 router)', value: 'router'},
          {name: 'UI Router', value: 'uirouter'},
          {name: 'Angular Router', value: 'ngroute'}
        ]
      }, {
        when: !this.options.styling,
        type: 'list',
        name: 'styling',
        message: 'Which CSS Styling Framework would you like?',
        choices: [
          {name: 'Bootstrap', value: 'bootstrap'},
          {name: 'None', value: 'none'}
        ]
      }];

      return this.prompt(prompts).then(props => {
        Object.assign(this.props, props);
      });
    }
  },

  configuring() {
    this.config.set('props', this.props);
    const pkg = Object.assign({}, {
      name: "app",
      version: "0.0.0",
      dependencies: {
        angular: '^1.5.0'
      },
      devDependencies: {
        'angular-mocks': '^1.5.0'
      }
    });
    if (this.props.router === 'uirouter') {
      pkg.dependencies['angular-ui-router'] = '1.0.0-beta.1';
    }
    if (this.props.router === 'ngroute') {
      pkg.dependencies['angular-route'] = '1.6.0';
    }
    if (this.props.styling === 'bootstrap') {
      if (this.props.css === 'scss') {
        pkg.dependencies['bootstrap-sass-official'] = '3.3.4';
      }
      pkg.dependencies.bootstrap = '3.3.4';
      if (this.props.module === 'bower') {
        pkg.dependencies['angular-bootstrap'] = '^2.3.1';
      }
      pkg.dependencies['angular-bootstrap-npm'] = '^0.14.3';
    }
    if (this.props.module === 'bower') {
      this.mergeJson('bower.json', pkg);
    }
    this.mergeJson('package.json', pkg);
  },

  composing() {
    const options = {
      framework: this.props.client,
      html: this.props.html,
      css: this.props.css,
      js: this.props.js,
      router: this.props.router,
      styling: this.props.styling,
      skipInstall: this.props.skipInstall,
      skipCache: this.props.skipCache
    };

    this.composeWith(`bitmate-angular1:basic`, {options}, {
      local: require.resolve(`../basic`)
    });
  },

  writing() {
    const files = [
      'client/index.html',
      'client/favicon.ico',
      'client/robots.txt',
      'client/.htaccess'
    ];

    files.forEach(file => {
      this.copyTemplate(file, file, this.props);
    });
  }
});
