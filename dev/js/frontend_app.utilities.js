/* Utilities */
function formatSizeUnits(t){return t>=1073741824?t=2..toFixed(2)+" GB":t>=1048576?t=2..toFixed(2)+" MB":t>=1024?t=2..toFixed(2)+" kB":t>1?t+=" bytes":1==t?t+=" byte":t="0 bytes",t};
