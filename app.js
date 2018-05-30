// BUDGET/DATA CONTROLLER
var dataController = (function(){

  var Expense = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value
  };

  var Income = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  }

  return {
    addItem: function(type, des, val){
      var newItem, ID;

      ID = 0;

      if(type === 'exp'){
        newItem = new Expense(ID, des, val);
        data.allItems.exp.push(newItem);
        data.totals.exp += val;
      } else if (type === 'inc'){
        newItem = new Income(ID, des, val);
        data.allItems.inc.push(newItem);
        data.totals.inc += val;
      };

    },
    getData: data
  };

})();


// UI CONTROLLER
var UIcontroller = (function(){
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }
  return {
    getInput: function(){
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      }
    },
    getDOMstrings: function(){
      return DOMstrings;
    }
  }

})();


// GLOBAL APP CONTROLLER
var controller = (function(DataCtrl, UIctrl){
  var setupEventListeners = function(){
    var DOM = UIctrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
      if(event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
      }
    })
  };

  var ctrlAddItem = function(){
    // 1. get the input value/data
    var input = UIctrl.getInput();
    console.log(input);
    var val = parseInt(input.value);
    input.value = val;
    console.log(input);

    // 2. add to budget controller
    DataCtrl.addItem(input.type, input.description, input.value);

    // 3. add item to UI
    var data = DataCtrl.getData;
    console.log(data);
    
    // 4. calculate new budget

    // 5. display budget on UI

  };

  return {
    init: function(){
      console.log('init app');
      setupEventListeners();
    }
  }


})(dataController, UIcontroller);


controller.init();

// in de global controller voer je de methods uit, met de data die je haalt (en dus 'maakt' in je UI en budget -controllers
