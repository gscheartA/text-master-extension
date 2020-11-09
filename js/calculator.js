// error show
function printErrStr(str, i) {
  let ss = "";
  for (let ii = 0; ii < str.length; ii++)
    ss = ss + (i == ii ? '^' : ' ');
  return str + '\n' + ss
}
// format filter and programma detect
function tokenCode(str) {
  // save string parse result and description information
  let tokens = [];
  let token, currentChar;
  // token record previously
  let prev = {};
  // bracket index statistics
  let bract = [];
  for (let i = 0; i < str.length; i++) {
    currentChar = str[i];
    if (currentChar == ' ') continue;
    if (/[0-9]/.test(currentChar)) {
      token = {
        type: 'number',
        value: currentChar,
      };
      // point?
      let pot = false;
      // space?
      let space = false;
      for (i++; i < str.length; i++) {
        currentChar = str.charAt(i);
        if (/[0-9]/.test(currentChar)) {
          if (space) throw new Error(`error number format`);
          token.value += currentChar;
        } else if (currentChar === '.') {
          if (space) throw new Error(`error number format`);
          if (pot) throw new Error(`error point format`);
          token.value += currentChar;
          pot = true;
        } else if (currentChar === ' ') {
          space = true;
        } else {
          i--;
          break;
        }
      }
      if (prev.prefix) {
        token.value = prev.value + token.value;
        tokens.pop();
      }
    } else if ('+-*/'.includes(currentChar)) {
      token = {
        type: 'operator',
        value: currentChar,
      };
      //
      if (currentChar == '-' && (((tokens.length == 0) || (i > 0 && ((prev.type == 'operator') || (prev.value == '('))))) && !prev.prefix) {
        token.prefix = true;
      } else if ((i > 0 && prev.type != 'operator' && prev.value != '(') && !prev.prefix) {
      } else {
        throw new Error(`error symbol format`);
      }
    } else if ((currentChar === '(' && prev.value != ')' && !prev.prefix)) {
      token = {
        type: 'Punctuator',
        value: currentChar,
      }
      bract.push(i);
    } else if ((currentChar === ')' && prev.value != '(' && !prev.prefix)) {
      token = {
        type: 'Punctuator',
        value: currentChar
      }
      if (bract.pop() == undefined) throw new Error(`bracket mismatch`);
    } else {
      throw new Error(`unrecognized character`);
    }
    tokens.push(token);
    prev = token;
  }
  if (bract.length > 0) throw new Error(`bracket mismatch`);
  return tokens;
}


function parse(tokens, operator) {
  // record operator
  let operatorStack = [];
  // record value
  let numStack = [];
  // priority mapping between operators and brackets
  let precedence = {
    '(': -1,
    ')': 0,
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };
  // operator
  let opts = Object.keys(precedence);
  // operator binding calculation function
  operator = operator || {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
  };
  // determine whether the calculation is allowed to be performed
  function allow() {
    // two value stacks and one character stack
    return numStack.length >= 2 && operatorStack.length >= 1;
  }
  // calculator
  function count() {
    // take out two values
    let e2 = numStack.pop();
    let e1 = numStack.pop();
    // take out
    let op = operatorStack.pop();
    // calculate and save the result value
    let fn = operator[op];
    if (fn) numStack.push(fn(e1, e2));
  }
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    if (token.value == '(') {
      operatorStack.push(token.value);
    } else if (token.type == "number") {
      numStack.push(Number(token.value));
    } else if (token.type == "operator" || token.type == "Punctuator") {
      while (allow() && precedence[token.value] <= precedence[operatorStack.slice(-1)])
        count();
      if (token.value == ')')
        operatorStack.pop();
      else
        operatorStack.push(token.value);
    } else {
      throw new Error(`Unknown error`);
    }
  }
  while (allow())
    count();
  return numStack.pop();
}


function accAdd(arg1, arg2) {
  var r1, r2, m, c;
  try {
    r1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    var cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", "")) * cm;
    } else {
      arg1 = Number(arg1.toString().replace(".", "")) * cm;
      arg2 = Number(arg2.toString().replace(".", ""));
    }
  } else {
    arg1 = Number(arg1.toString().replace(".", ""));
    arg2 = Number(arg2.toString().replace(".", ""));
  }
  return (arg1 + arg2) / m;
}
/**
 ** @desc The subtraction function is used to get the exact subtraction result
 ** @desc Note: the subtraction result of JavaScript will have errors,
          which will be more obvious when two floating-point numbers are subtracted.
          This function returns a more accurate subtraction result.
 ** @param  {Number}
 ** @param {Number} accSub(arg1,arg2)
 ** @return {Number} The exact result of arg1 + arg2
 **/
function accSub(arg1, arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
/**
 ** @desc The multiplication function is used to get the exact multiplication result
 ** @desc Note: the multiplication result of JavaScript will have errors,
          which will be more obvious when two floating-point numbers are multiplicated.
          This function returns a more accurate multiplication result.
 ** @param  {Number}
 ** @param {Number} accMul(arg1,arg2)
 ** @return {Number} The exact result of arg1 * arg2
 **/
function accMul(arg1, arg2) {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  }
  catch (e) {
  }
  try {
    m += s2.split(".")[1].length;
  }
  catch (e) {
  }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
/**
 ** @desc The division function is used to get the exact division result
 ** @desc Note: the division result of JavaScript will have errors,
          which will be more obvious when two floating-point numbers are divided.
          This function returns a more accurate division result.
 ** @param  {Number}
 ** @param {Number} accDiv(arg1,arg2)
 ** @return {Number} The exact result of arg1 / arg2
 **/
function accDiv(arg1, arg2) {
  var t1 = 0, t2 = 0, r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
  }
  try {
    t2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
  }
  if (Math) {
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
  }
}
