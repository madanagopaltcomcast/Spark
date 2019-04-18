'use strict';

let imports = {
  scene: 'px:scene.1.js',
  assert: '../test-run/assert.js',
  manual: '../test-run/tools_manualTests.js'
};

const importsPromise = px.import(imports);

module.exports.beforeStart = () => importsPromise;

importsPromise.then(im => {
  imports = im;
  imports.assert = imports.assert.assert;
  if (imports && imports.manual.getManualTestValue() === true) {
    imports.manual.runTestsManually(module.exports.tests, module.exports.beforeStart);
  }
});

module.exports.tests = {};

module.exports.tests.test01_getStorage = () => {
  const storage = imports.scene.storage;

  return Promise.resolve(imports.assert(storage, 'no storage'));
};

module.exports.tests.test02_setItem_getItem = () => {
  const storage = imports.scene.storage;

  storage.setItem('key1', 'value1');
  storage.setItem('key2', 'value2');
  const value1 = storage.getItem('key1');
  const value2 = storage.getItem('key2');
  const valueNotExisting = storage.getItem('keyNotExisting');

  return Promise.resolve(imports.assert(
    value1 === 'value1' && value2 === 'value2' && valueNotExisting === '',
    'setItem/getItem doesn\'t work'));
};

module.exports.tests.test03_updateItems = () => {
  const storage = imports.scene.storage;

  storage.setItem('key1', 'value1');
  storage.setItem('key2', 'value2');
  const value1 = storage.getItem('key1');
  const value2 = storage.getItem('key2');
  storage.setItem('key1', 'value3');
  storage.setItem('key2', 'value4');
  const value3 = storage.getItem('key1');
  const value4 = storage.getItem('key2');

  return Promise.resolve(imports.assert(
    value1 === 'value1' && value2 === 'value2' && value3 === 'value3' && value4 === 'value4',
    'update doesn\'t work'));
};

module.exports.tests.test04_clear = () => {
  const storage = imports.scene.storage;

  storage.setItem('key1', 'value1');
  storage.setItem('key2', 'value2');
  storage.setItem('key3', 'value3');
  storage.setItem('key4', 'value4');
  storage.clear();
  const value1 = storage.getItem('key1');
  const value2 = storage.getItem('key2');
  const value3 = storage.getItem('key3');
  const value4 = storage.getItem('key4');

  return Promise.resolve(imports.assert(
    value1 === '' && value2 === '' && value3 === '' && value4 === '',
    'clear doesn\'t work'));
};

module.exports.tests.test05_removeItem = () => {
  const storage = imports.scene.storage;

  storage.clear();
  storage.setItem('key1', 'value1');
  storage.setItem('key2', 'value2');
  storage.setItem('key3', 'value3');
  storage.setItem('key4', 'value4');
  storage.removeItem('key1');
  storage.removeItem('key3');
  const value1 = storage.getItem('key1');
  const value2 = storage.getItem('key2');
  const value3 = storage.getItem('key3');
  const value4 = storage.getItem('key4');

  return Promise.resolve(imports.assert(
    value1 === '' && value2 === 'value2' && value3 === '' && value4 === 'value4',
    'removeItem doesn\'t work'));
};

module.exports.tests.test06_getItems = () => {
  const storage = imports.scene.storage;

  storage.clear();
  const valueClear = storage.getItems();
  storage.setItem('key1', 'value1');
  storage.setItem('key2', 'value2');
  const value = storage.getItems();

  return Promise.resolve(imports.assert(
    valueClear.length === 0 && value.length === 2 &&
    value[0].key === 'key1' && value[0].value === 'value1' &&
    value[1].key === 'key2' && value[1].value === 'value2',
    'getItems doesn\'t work'));
};

module.exports.tests.test07_getItemsPrefix = () => {
  const storage = imports.scene.storage;

  storage.clear();
  storage.setItem('key1', 'value1');
  storage.setItem('prefix1_key1', 'prefix1_value1');
  storage.setItem('key2', 'value2');
  storage.setItem('prefix1_key2', 'prefix1_value2');
  const value = storage.getItems('prefix1');

  return Promise.resolve(imports.assert(
    value.length === 2 &&
    value[0].key === 'prefix1_key1' && value[0].value === 'prefix1_value1' &&
    value[1].key === 'prefix1_key2' && value[1].value === 'prefix1_value2',
    'getItems with prefix doesn\'t work'));
};

module.exports.tests.test08_persistence = () => {
  let storage = imports.scene.storage;

  storage.clear();
  storage.setItem('key1', 'value1');

  storage = imports.scene.storage;

  const value1 = storage.getItem('key1');

  return Promise.resolve(imports.assert(value1 === 'value1', 'persistence doesn\'t work'));
};

module.exports.tests.test09_capabilities = () => {
  const capabilities = imports.scene.capabilities;

  return Promise.resolve(imports.assert(capabilities && capabilities.storage === 1, 'capabilities wrong'));
};
