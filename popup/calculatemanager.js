document.getElementById('textcalculatorinput').oninput = (e) => {
  var inputText = e.target.value;
  if (inputText == "") {
    document.getElementById('textcalculatorresult').innerHTML = "";
    return;
  }
  try {
    result = parse(tokenCode(inputText), { '+': accAdd, '-': accSub, '*': accMul, '/': accDiv });
    result = Math.round(result * 10000) / 10000;
    document.getElementById('textcalculatorresult').innerHTML = result;
  }
  catch (e) {
    document.getElementById('textcalculatorresult').innerHTML = e.toString().slice(7);
  }
}
