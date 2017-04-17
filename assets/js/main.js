var ixigo = ixigo || {};

var ixigo = (function(){
	var fn, api, cache;

	cache = { 														// ********* To store common variables *****//
		taskCont: document.getElementById('taskCont'),
		txtId :  document.getElementById('txt'),
		errId: document.getElementById('err'),
		taskDetailCont:document.getElementById('taskDetailCont'),
		mainContainer:document.getElementById('mainContainer'),
		localii :[],
		bodyElm:document.getElementsByTagName('body'),
		newTask:document.getElementById('newTask'),
		localStr: [],
		boardCard :document.getElementsByClassName('boardCard')
	}

	window.task = fn = {
		_init: function(){
        	fn._bindEvents(); 		//******* To bind events ******// 
            fn._createComponent(); //******* To create Board ******// 
            fn._displayTask(); // ********* To display Tasks *****//

        },
        
        _bindEvents: function(){
        	var butn = document.getElementById('create')
        	var html = '';
        	var localVal ='';
        	var currComp=1;
        	var el = document.getElementById('txt');

        	el.onblur = function(){
        		this.setAttribute('readonly','readonly');

        		if (typeof(Storage) !== "undefined") {
        			localStorage.setItem("CompanyName", cache.txtId.value);
        		} 
        		if(document.getElementById('boardName')){
        			document.getElementById('boardName').innerHTML =localStorage.getItem("CompanyName"); 

        		}
        	};

        	el.onclick = function(){
        		this.removeAttribute('readonly','readonly');
        		cache.errId.classList.add("hidden");
        	};

        	taskDetailCont.addEventListener('click', function(e){
        		fn._removeTask(e);
        	});

        	var butn = document.getElementById('create');
        	butn.addEventListener('keypress', function(event){
        		var keycode = (event.keyCode ? event.keyCode : event.which);
        		if(keycode == '13'){
        			$('#butn').click();
        		}
        	});


        },
        _createComponent: function(currComp){						// ********* Create Components *****//
        	var butn = document.getElementById('create')

        	butn.addEventListener('click', function(e){
        		var html = '';

        		if (typeof(Storage) !== "undefined") {
        			localStorage.setItem("CompanyName", cache.txtId.value);
        		} 
        		if(cache.txtId.value.length >0 && cache.txtId.value.indexOf(' ') !== 0){
        			if(!(document.getElementById('taskComponent'))){
        				cache.boardCard[0].classList.add("styleController")
        				html += '<h2 class="mb10 boardName" id="boardName">'+localStorage.getItem("CompanyName")+ '</h2><input type="text" name ="tsk" id="taskTxtId"> <button class="taskBtn btn" id="taskBtn">CREATE TASK</button><div id="err1" class="err1 hidden">Please Create Task.</div>';
        				var newEle = document.createElement('div');
        				newEle.setAttribute('class', 'taskComponent ');
        				newEle.setAttribute('id', 'taskComponent');
        				newEle.innerHTML = html;
        				cache.taskCont.appendChild(newEle);
        				fn._createTask();
        				return newEle;
        			}

        		}else{
        			cache.errId.classList.remove("hidden");
        		}
        	});

        },
        _createTask: function(){								// ********* Create Tasks Function *****//
        	var taskButn = document.getElementById('taskBtn');
        	var taskTxtId = document.getElementById('taskTxtId');
        	var localComponent = [];
        	var i =0;
        	taskButn.addEventListener('click', function(e){								// ********* Creation of  Tasks on Click of button & saving them into local storage *****//
				if(taskTxtId.value.length >0 && taskTxtId.value.indexOf(' ') !== 0){
					var err1 = document.getElementById('err1')
					err1.classList.add("hidden");
					if(localStorage.boardData && localStorage.boardData.length>0){

						localComponent = JSON.parse(localStorage.getItem("boardData"));	
						var aa = true;
						for(var k=0; k<localComponent.length; k++){
							if(localComponent[k].head == cache.txtId.value){
								localComponent[k].task.push(taskTxtId.value)
								aa = false;
							}else if(!(localComponent[k].head == cache.txtId.value)) {
								i++;
							}

						}
						if(aa == true){
							var componentsDynamic = {'head':cache.txtId.value,'task':[taskTxtId.value]}
							localComponent.push(componentsDynamic);
						}
					}
					else{
						localComponent  =[{'head':cache.txtId.value,'task':[taskTxtId.value]}];
					}
					if (typeof(Storage) !== "undefined") {

						localStorage.setItem("boardData",JSON.stringify(localComponent));
					}
					var html = '';                                    // ********* Displaying tasks on creation *****//
					var newEle1 = document.createElement('div');
					newEle1.setAttribute('class', 'newTask mt10');
					html += '<div class="mb20 taskDetail" data-component="'+document.getElementById('boardName').innerHTML+'" data-val="'+taskTxtId.value+'" >'+taskTxtId.value+ '<span class="crossIcon"></span></div>';
					newEle1.innerHTML = html;
					cache.newTask.appendChild(newEle1);
					var elm = document.getElementById('taskTxtId')
					elm.value ='';
				}
				else{
					var err1 = document.getElementById('err1')
					err1.classList.remove("hidden");
				}
			});

        },
        _displayTask: function(){ 							// ********* Function to display created tasks *****//
        	var html = '';
        	if(localStorage.boardData && localStorage.boardData.length>0){
        		var localdata = JSON.parse(localStorage.getItem("boardData"));
        		var newEle = document.createElement('div');
        		newEle.setAttribute('class', 'createdTasks mt10');
        		newEle.setAttribute('id', 'taskDetailComponent');
        		for (var x = 0;x< localdata.length; x++){
        			html += '<h2 class="mb10 mt30 componentVal">'+localdata[x].head+ '</h2>';               // ********* Display Already created tasks *****//
        			for(var i=0; i< localdata[x].task.length; i++){
        				html += '<div class="mb20 taskDetail" data-componentOne="'+localdata[x].head +'" data-component="'+localdata[x].head +'" data-val="'+localdata[x].task[i]+'">'+localdata[x].task[i]+'<span class="crossIcon"></span></div>';
        				newEle.innerHTML = html;
        				cache.taskDetailCont.appendChild(newEle);
        			}
        		}
        	}
        	return newEle;
        },
        _removeTask: function(e){   		// ********* Function to remove tasks on click of cross *****//
        	var target = e.target;
        	if(target.getAttribute('class').indexOf('crossIcon') > -1){
        		target.parentElement.classList.add("hidden");
        	}
        	var localdataVal = JSON.parse(localStorage.getItem("boardData"));
        	var dataValue = target.parentElement.getAttribute('data-val');
        	var dataComponent = target.parentElement.getAttribute('data-component');
	       	for(var a=0; a<localdataVal.length; a++){									
	       		if(localdataVal[a].head == dataComponent){
	       			localdataVal[a].task.splice(localdataVal[a].task.indexOf(dataValue),1);
	       			if(localdataVal[a].task.length < 1){
	       				localdataVal.splice(a,1);
	       				var dataComponentOne = target.parentElement.getAttribute('data-componentOne');
	       				for(var j=0; j<dataComponentOne.length; j++){
	       					var aaa = target.parentElement.getAttribute('data-componentOne');
	       					if(document.getElementsByClassName('componentVal')){
	       						var bbb = document.getElementsByClassName('componentVal')[j]
	       						if(aaa == bbb.innerHTML){
	       							bbb.classList.add("hidden");
	       							break;
	       						}
	       					}
	       				}
	       			}
	       			localStorage.setItem("boardData",JSON.stringify(localdataVal)); 				// ********* Resetting localstorage again with removed data updated  *****//
	       		}
	       	}
	    }


	   };

	   api = {
	   	init: function(){
	   		return fn._init.apply(this, arguments);
	   	}
	   };

	   return api;

	})();
	ixigo.init();     // ********* Calling all the function in init *****//