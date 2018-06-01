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
    calculateItemPercentage: function(val){
      var percentage = (val * 100) / data.totals.inc;
      return percentage;
    },
    getExpPercentage: function(){
      var percentage, p;
      percentage = (data.totals.exp * 100) / data.totals.inc;
      p = Math.round((percentage + 0.00001) * 100) / 100;
      return p;
    },
    deleteItem: function(itemId, type){
      var ids, index;
      ids = data.allItems[type].map(function(i){
        return i.id;
      });
      index = ids.indexOf(itemId);
      if(index !== -1){
        data.allItems[type].splice(index, 1);
      };
      console.log(data.allItems[type]);
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
    totalIncome: '.budget__income--value',
    totalExpenses: '.budget__expenses--value',
    expPercentage: '.budget__expenses--percentage',
    itemPercentage: '.item__percentage',
    container: '.container'
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
    addItem: function(obj, type, perc){
      var html, newHtml, element;
      if(type === 'inc'){
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        element = document.querySelector(DOMstrings.incomeContainer);
      } else if (type === 'exp'){
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%item-percentage%%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        element = document.querySelector(DOMstrings.expensesContainer);
      };

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      newHtml = newHtml.replace('%item-percentage%', perc);

      element.insertAdjacentHTML('beforeend', newHtml);
    },
    deleteItem: function(list){
      list.remove();
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
      var contentE = document.querySelector(DOMstrings.totalExpenses).textContent = '-' + e;
      return contentE;
    },
    displayPercentage: function(p){
      var contentP = document.querySelector(DOMstrings.expPercentage).textContent = p + '%';
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
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
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

    var percentageDisplay = DataCtrl.getExpPercentage();
    UIctrl.displayPercentage(percentageDisplay);
  }

  var ctrlAddItem = function(){
    // 1. get the input value/data
    var input = UIctrl.getInput();

    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      // 2. add to budget controller
      var newItem = DataCtrl.addItem(input.type, input.description, input.value);

      var percentageItem;
      if(input.type === 'exp'){
        percentageItem = DataCtrl.calculateItemPercentage(input.value);
        percentageItem = Math.round((percentageItem + 0.00001) * 100) / 100;
      };

      // 3. add item to UI
      UIctrl.addItem(newItem, input.type, percentageItem);

      // 4. clear inputfiels
      UIctrl.clearFields();

      // 5. update and display budget
      updateBudget();

    } else {
      alert('Please Enter Valid Data');
    }
  };

  var ctrlDeleteItem = function(event){
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemID){
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);
      console.log(type, ID);
    }

    // delete item from data
    DataCtrl.deleteItem(ID, type);
    // deleting data from UI
    UIctrl.deleteItem(event.target.parentNode.parentNode.parentNode.parentNode);
    // update and show new budget
  };

  return {
    init: function(){
      console.log('init app');
      UIctrl.displayTotalIncome(0);
      UIctrl.displayTotalExpenses(0);
      UIctrl.displayPercentage(0);
      setupEventListeners();
    }
  }


})(dataController, UIcontroller);


controller.init();

// in de global controller voer je de methods uit, met de data die je haalt (en dus 'maakt' in je UI en budget -controllers
