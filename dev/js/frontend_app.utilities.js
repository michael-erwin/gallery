/* Utilities */
function formatSizeUnits(bytes){if(bytes == 0) return '0 Bytes';var k = 1000,dm = 2,sizes = ['B', 'kB', 'MB', 'GB', 'TB'],i = Math.floor(Math.log(bytes) / Math.log(k));return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];}
String.prototype.UCFirst = function() {return this.charAt(0).toUpperCase() + this.slice(1);}
