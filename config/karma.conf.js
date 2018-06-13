module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      '../node_modules/systemjs/dist/system.js',
      './system.conf.js',
      { pattern: '../src/**/*.ts' }
    ],
    preprocessors: {
      '../src/**/*.ts': 'karma-typescript'
    },
    reporters: ['dots', 'karma-typescript'],
    browsers: ['Chrome'],
    karmaTypescriptConfig: {
      compilerOptions: {
        noImplicitAny: false,
        sourceMap: true,
        target: "ES6"
      },
      include: [
        '../src/**/*'
      ],
      reports: {
        "cobertura": {
          "directory": "coverage",
          "filename": "../cov.xml"
        },
        "html": "coverage"
      }
    }
  });
};
