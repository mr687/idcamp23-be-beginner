function Logger(namespace = "Default") {
  this.namespace = namespace;
}

Logger.prototype.info = (...args) => {
  console.info(`[${this.namespace}][INFO]`, ...args);
};

Logger.prototype.error = (...args) => {
  console.error(`[${this.namespace}][ERROR]`, ...args);
};

module.exports = Logger;
