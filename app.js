/*
A: UI MODULE:
  -Get input from data
  -Add new item to UI
  -Upddate the UI

B: Data Module:
  -Add new item to data structure
  -calculateBudgjet

C: Controll Module:
  -Add even handler
*/
//in IIFE variable and function cannot be access from the outside.
// in IIFE the function start immidiatly and no need to call it to be done
//return object contain all function we want to get outside scope be accessed.
var BudgetController = (function(){
  var Expense= function(id,description,value){
    this.id= id;
    this.description= description;
    this.value = value;
    this.precentage = -1;
  }

  var Income = function(id,description,value){
    this.id= id;
    this.description= description;
    this.value = value;
  }
  
  Expense.prototype.calcPercentage = function(totalIncome){
      if(totalIncome>0)
      this.precentage = Math.round((this.value/totalIncome)*100);
      else
          this.precentage=-1;
  };
  var calculateTotal= function(type){
      var sum = 0;
      data.allItems[type].forEach(function(current){
          sum+= current.value;
      });
      data.totals[type] =sum;
     
  };
    
    Expense.prototype.getPercentage = function(){
        return this.precentage;
    };

  var data={
    allItems: {
      exp:[],
      inc:[]
    },
    totals:{
      exp:0,
      inc:0
    },
    budget :0,
    precantage :-1
  };
  
  return {
    addItem: function(type,des,val){
      var newItem;
      //id for a new item
        if(data.allItems[type].length>0){
            Id =data.allItems[type][data.allItems[type].length-1].id+1;
        }
      else{
          Id=0;
      }
      if (type ==='exp'){
      newItem= new Expense(Id,des,val)
    }
      else if(type==='inc') {
      newItem = new Income(Id,des,val)
      }
      data.allItems[type].push(newItem);
      return newItem;
    },
      
      deleteItem: function(type, id){
          var index,ids;
           ids= data.allItems[type].map(function(current){
              return current.id;
          })
          
          index = ids.indexOf(id);
          if  (index !== -1){
              data.allItems[type].splice(index,1)
          }
          
      },
      calculateBudjet: function(){
          var totalInc,totalExp
          // calculate total inc, exp
          calculateTotal('inc');
          calculateTotal('exp');
          //calculate the budget :income-exp
          data.budget = data.totals.inc- data.totals.exp;
          //calculate the precentage of income that we spent
          if(data.totals.inc>0)
          data.precantage = Math.round((data.totals.exp/data.totals.inc) * 100);
          else{
              data.precantage=-1;
          }
          
      },
      calculatePercantages : function(){
          data.allItems.exp.forEach(function(current){
             current.calcPercentage(data.totals.inc); 
          });
          
      },
      getPercentage: function(){
          var allPerc = data.allItems.exp.map(function(cur){
              return cur.getPercentage();
          })
          return allPerc;
      },
    testing: function(){
      console.log(data)
    },
      allbud: function(){
          return{  
            bud: data.budget,
            totalinc:data.totals.inc,
            totalexp:data.totals.exp,
            precant : data.precantage
                }
                
      }
  
//      totalItem: function(kind){
//          var total=0;
//          if(kind ==='exp'){
//              data.inc.forEach(function(current){
//                  total+=parseInt(current.value);
//              })
//          }
//          return total;
//      }
  }
}) ();

var UIController = (function (){
  var DOMstrings={
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeCont: '.income__list',
    expensCont: '.expenses__list',
    incomeLabel: '.budget__income--value',
    expLabel:   '.budget__expenses--value',
    budgetLabel: '.budget__value',
    precantageLabel: '.budget__expenses--percentage',
      container: '.container',
      expensesPercLable:'.item__percentage',
      dateLabel: '.budget__title--month'
  }
  var nodeListForEach = function(list,callback){
            for(var i =0;i<list.length;i++){
                callback(list[i],i)
            }
        };

  return {
    getinput: function(){
      return{
         type  : document.querySelector(DOMstrings.inputType).value,
         description : document.querySelector(DOMstrings.inputDescription).value,
         value :  parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItems: function(obj,type){
        var html,newHtml,element;
        //creat html string with placeholder text
        if(type==='inc'){
            element = DOMstrings.incomeCont;
            html= '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }else if(type ==='exp')
            {
                element= DOMstrings.expensCont;
                html= '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

        newHtml = html.replace('%id%',obj.id);
        newHtml = newHtml.replace('%description%',obj.description);
        newHtml = newHtml.replace('%value%',this.formatNumber(obj.value,type));

        //replace the placeholder text with some actual data
        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        //insert the html into the DOM


    },
      deleteListItem: function(selectorId){
          var el = document.getElementById(selectorId);
          el.parentNode.removeChild(el);
          
      },
      
    clearFields :function(){
        var fields;
        //conver a list into array using the Array methods.
        fields= document.querySelectorAll(DOMstrings.inputDescription + ', '+DOMstrings.inputValue);
        var filedsArray = Array.prototype.slice.call(fields);
        // we have access to this 3 fields of for each function
        filedsArray.forEach(function(current,index,array){
            current.value="";
        });
        
    },
      formatNumber: function(num,type){
          var numSplit,int,dec,sign;
        /* + or - before number
        exactly 2 deciaml points 
        comma seperating the thousands
        */
          
          num = Math.abs(num);
          //method that put 2 decimal numbers after the point
          num = num.toFixed(2);
          
          numSplit = num.split('.');
          int  = numSplit[0];
          
          
          dec = numSplit[1];
          if (int.length>3){
              int = int.substr(0,int.length-3)+ ',' + int.substr(int.length-3,int.length);
          }
          
          type === 'exp'? sign ='-' :sign='+';
          return sign+ ' ' + int+ '.'+dec;
      },
    getTheDomStrings: function(){
      return DOMstrings;
    },
      changedType: function(){
          var fields;
          fields= document.querySelectorAll(DOMstrings.inputType +','+ DOMstrings.inputDescription+','+DOMstrings.inputValue);
          nodeListForEach(fields,function(cur){
              cur.classList.toggle('red-focus')
          })
          document.querySelector(DOMstrings.inputButton).classList.toggle('red');
      },
      displayMonth : function(){
          var now,year,month,months;
          months= ['January','February','March','April','May','June','July','August','September','October','November','December']
          //if dont pass anything to constructor will return today day
          now= new Date();
          month =now.getMonth();
          year= now.getFullYear();
          document.querySelector(DOMstrings.dateLabel).textContent =months[month]+' '+ year;
          
      },
      updateUIBud : function(obj){
          var type;
          obj.bud >0? type = 'inc' : type = 'exp';
           document.querySelector(DOMstrings.budgetLabel).textContent= this.formatNumber(obj.bud,type);
          document.querySelector(DOMstrings.incomeLabel).textContent= this.formatNumber(obj.totalinc,'inc');
          document.querySelector(DOMstrings.expLabel).textContent= this.formatNumber(obj.totalexp,'exp');
          
          if(obj.precant>0)
              document.querySelector(DOMstrings.precantageLabel).textContent= obj.precant+'%';
          else
              document.querySelector(DOMstrings.precantageLabel).textContent = '---'
              
      },
      displayPerentages: function(percentages){
        var fields =document.querySelectorAll(DOMstrings.expensesPercLable)
        
          nodeListForEach(fields,function(current,index){
              if(percentages[index]>0)
              current.textContent = percentages[index]+'%';
              else
                  current.textContent = '---'
          });
      }
  }
}) ();
var controller = (function (BudgetCntrl,UIcntrl){
      var setupEventListeners= function(){
        var DOM= UIcntrl.getTheDomStrings();
        document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem);
        // We are not taking any select because this can be pressed anywhere in the site, the "Enter"
        //wich is for older borrowsers
        document.addEventListener('keypress',function(event){
          if(event.keyCode ===13 )
          ctrlAddItem();
        });
         document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem) 
          document.querySelector(DOM.inputType).addEventListener('change',UIcntrl.changedType)
      }
      var updateBudget = function(){
          //1, calculate budget
          BudgetController.calculateBudjet();
          //2. return budget
          var b = BudgetController.allbud();
          //3. Display the budget
          UIcntrl.updateUIBud(b);
      };
    var ctrlAddItem= function(){
        var inpu,newItem,b;
        // 1. Get the field input data
        
       inpu=UIcntrl.getinput();
        if(inpu.description !=="" && !isNaN(inpu.value) && inpu.value>0){
            // 2. Add the item to the budget controller
       newItem = BudgetController.addItem(inpu.type,inpu.description,inpu.value);
        // 3. Add the item to the UI
        UIcntrl.addListItems(newItem,inpu.type);
        // 4. Clear the fields
        UIcntrl.clearFields();
        
        // 5. Calculate and update the budget
        updateBudget();
        
        // 6. update percentages
        updatePercentages();
            
        
        }
        
    /*
      To do:
        - Take info about the desctiption
        -Take info about the number
        -Add item to budget controller
        -check wheter it is income or outcome
        -Add item to UI
        -Calculate budget
        -Display
    */
  }
    var ctrlDeleteItem = function(event){
        
        var itemId,splitID,type,ID;
          itemId= event.target.parentNode.parentNode.parentNode.parentNode.id
        
    
        if (itemId){
            splitID= itemId.split('-');
            type = splitID[0];
            ID= parseInt(splitID[1]);
            
            // 1. delete the item from data strucute
            BudgetCntrl.deleteItem(type,ID);
            UIcntrl.deleteListItem(itemId);
            // 2. delete item from UI
            // 3. Update and show the new budget.
            updateBudget();
            updatePercentages();
        }
        }
    var updatePercentages = function(){
        
        // 1. calculate precentages
        BudgetCntrl.calculatePercantages();
        // 2. Read percentage from the budget controller
        var precantages= BudgetCntrl.getPercentage();
        // 3. Update the UI with the new percentages.
        UIcntrl.displayPerentages(precantages)
    };
  return {
    init: function(){
      console.log('Application has started');
        UIcntrl.displayMonth();
        UIcntrl.updateUIBud({
            bud: 0,
            totalinc:0,
            totalexp:0,
            precant : -1
        })
      setupEventListeners();
    
    }
  }
}) (BudgetController,UIController);

controller.init();
