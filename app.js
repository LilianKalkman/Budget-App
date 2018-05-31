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

      if(data.allItems[type].length > 0){
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      };

      if(type === 'exp'){
        newItem = new Expense(ID, des, val);
        data.allItems.exp.push(newItem);
        data.totals.exp += val;
      } else if (type === 'inc'){
        newItem = new Income(ID, des, val);
        data.allItems.inc.push(newItem);
        data.totals.inc += val;
      };
      return newItem;
    },
    calculateBudget: function() {
      var budget = data.totals.inc - data.totals.exp;
      return budget;
    },
    getTotals: function(){
      var totalInc, totalExp;
      var totals = [];
      totalInc = data.totals.inc;
      totalExp = data.totals.exp;
      totals.push(totalInc, totalExp);
      return totals;
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
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budget: '.budget__value',
    totalIncome: 'budget__income--value',
    totalExpenses: 'budget__expenses--value',
    expPercentage: 'budget__expenses--percentage'
  }
  return {
    getInput: function(){
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      }
    },
    getDOMstrings: function(){
      return DOMstrings;
    },
    addItem: function(obj, type){
      var html, newHtml, element;
      if(type === 'inc'){
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        element = document.querySelector(DOMstrings.incomeContainer);
      } else if (type === 'exp'){
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        element = document.querySelector(DOMstrings.expensesContainer);
      };

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      element.insertAdjacentHTML('beforeend', newHtml);
    },
    clearFields: function(){
      var fields, fieldsArray;

      fields = document.querySelectorAll('.add__description, .add__value');
      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function(el){
        el.value = null;
      });

      fieldsArray[0].focus();
    },
    displayBudget: function(b){
      var budgetText;
      if(b > 0){
        budgetText = document.querySelector(DOMstrings.budget).textContent = '+' + b;
      } else {
        budgetText = document.querySelector(DOMstrings.budget).textContent = b;
      };
      return budgetText;
    },
    displayTotalIncome: function(i){
      var contentI;
      contentI = document.querySelector(DOMstrings.totalIncome).textContent = '+' + i;
      return contentI;
    },
    displayTotalExpenses: function(e){
      var contentE = document.querySelector(DOMstrings.totalIncome).textContent = '-' + e;
      return contentE;
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

  var updateBudget = function(){
    var budget = DataCtrl.calculateBudget();
    UIctrl.displayBudget(budget);
    // get and show totals
    var totals = DataCtrl.getTotals();
    var totalInc = totals[0];
    var totalExp = totals[1];
    UIctrl.displayTotalIncome(totalInc);
    UIctrl.displayTotalExpenses(totalExp);

  }

  var ctrlAddItem = function(){
    // 1. get the input value/data
    var input = UIctrl.getInput();

    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      // 2. add to budget controller
      var newItem = DataCtrl.addItem(input.type, input.description, input.value);

      // 3. add item to UI
      UIctrl.addItem(newItem, input.type);

      // 4. clear inputfiels
      UIctrl.clearFields();

      // 5. update and display budget
      updateBudget();
    } else {
      alert('Please Enter Valid Data');
    }
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
