const LS_NAMESPACE = 'mathPlay'

var numberObject = {
    init: function() {
        this.mathOperation = 'addition';
        questionObject = LS_util.getMathPlayQuestion() || this.createQuestion(this.mathOperation);
        this.setQuestionObject(questionObject);       // floods the numberObject
    },
    setQuestionObject: function(questionObject) {
        this.questionObject = questionObject;
    },
    getQuestionObject: function () {
        return this.questionObject;
    },
    createQuestion: function(mathOperation) {
        lowNum = this.generateRandomNumber();
        highNum = this.generateRandomNumber();
        mathOperation = this.mathOperation;
        questionObject = {
                            lowNum: lowNum,
                            highNum: highNum,
                            mathOperation: mathOperation,
                            };
        LS_util.setMathPlayQuestion(questionObject);
        this.setQuestionObject(questionObject);
        return questionObject;
    },
    generateRandomNumber: function() {
        return Math.floor(Math.random() * Math.pow(10,1));
    },
    checkAnswer: function(answerInput) {
        questionObject = this.getQuestionObject();
        questionObject.userAnswer = answerInput;
        return questionObject;
    },
    getMathOperationSymbol: function(mathOperation) {
        var arithmatic = {
            addition: '+',
            subtraction: '-',
            multiplication: '*',
            division: '/',
        };
        return arithmatic[mathOperation];
    },
    setMathOperation: function(mathOperation) {
        this.mathOperation = mathOperation;
    },
};

var arithmatic = {
    addition: function(a,b) {
        return a + b;
    },
    subtraction: function(a,b) {
        return a-b;
    },
    multiplication: function(a,b) {
        return a*b;
    },
    division: function(a,b) {
        return a/b;
    }
};


var LS_util = {
    setMathPlayObjectToLS: function(data) {
        localStorage.setItem(LS_NAMESPACE, JSON.stringify(data));
    },
    getMathPlayObjectFromLS: function() {
        return JSON.parse(localStorage.getItem(LS_NAMESPACE));
    },
    getMathPlayQuestion: function() {
        return this.getMathPlayObjectFromLS() ? this.getMathPlayObjectFromLS().question : null; 
    },
    setMathPlayQuestion: function(questionObject) {
        var MathPlayObject = {};
        MathPlayObject.history = this.getMathPlayHistory();
        MathPlayObject.question = questionObject;
        this.setMathPlayObjectToLS(MathPlayObject);
    },
    getMathPlayHistory: function() {
        return this.getMathPlayObjectFromLS() ? this.getMathPlayObjectFromLS().history : null;
    },
    addMathPlayHistory: function(historyObject) {
        var MathPlayObject = {};
        MathPlayObject.question = this.getMathPlayQuestion();
        MathPlayObject.history = historyObject;
        this.setMathPlayObjectToLS(MathPlayObject);
    },
};

var view = {
    displayQuestion: function(questionObject) {
        symbol = numberObject.getMathOperationSymbol(questionObject.mathOperation);
        console.log(`Question: ${questionObject.lowNum} ${symbol} ${questionObject.highNum} = `);
    },
    displayHistory: function(historyObject) {
        i = historyObject.length;
        while(i--){
            var symbol = numberObject.getMathOperationSymbol(historyObject[i].mathOperation);
            var mathOperation = historyObject[i].mathOperation;
            correctAnswer = arithmatic[mathOperation](historyObject[i].lowNum,historyObject[i].highNum);
            var isCorrect = (correctAnswer === historyObject[i].userAnswer) ? 'Correct' : 'Incorrect';
            console.log(`${i}: ${isCorrect} - ${historyObject[i].lowNum} ${symbol} ${historyObject[i].highNum} = ${correctAnswer} ... You answered: ${historyObject[i].userAnswer}`);
        }
    },
    displayResponse: function(questionObject) {
        symbol = numberObject.getMathOperationSymbol(questionObject.mathOperation);
        correctAnswer = arithmatic[questionObject.mathOperation](questionObject.lowNum,questionObject.highNum);
        if (correctAnswer === questionObject.userAnswer) {
            console.log(`Correct: ${questionObject.lowNum} ${symbol} ${questionObject.highNum} = ${correctAnswer}`);
        } else {
            console.log(`Incorrect: ${questionObject.lowNum} ${symbol} ${questionObject.highNum} = ${correctAnswer}. You put ${questionObject.userAnswer}`);
        }
    }
};

var mathPlayHistory = {
    init: function() {
        this.getHistoryObject();
    },
    addQuestionToHistory: function(questionObject) {
        historyObject = this.getHistoryObject();
        historyObject.push(questionObject);
        LS_util.addMathPlayHistory(historyObject);
    },
    getHistoryObject: function() {
        return LS_util.getMathPlayHistory() || [];
    },
};

var h = handler = {
    question: function() {
        var questionObject = numberObject.getQuestionObject();
        view.displayQuestion(questionObject);
    },
    answer: function(answerInput) {
        var questionObject = numberObject.checkAnswer(answerInput);
        view.displayResponse(questionObject);
        mathPlayHistory.addQuestionToHistory(questionObject);
        this.nextQuestion();
    },
    nextQuestion: function() {
        var questionObject = numberObject.createQuestion();
        view.displayQuestion(questionObject); 
    },
    history: function() {
        var historyObject = mathPlayHistory.getHistoryObject();
        view.displayHistory(historyObject);
    },
    changeMathOperation: function(mathOperation) {
        numberObject.setMathOperation(mathOperation);
        this.nextQuestion();
    },
    clearMathPlay: function () {
        localStorage.clear();
        console.log('History cleared...');
    },
}

var App = {
    init: function() {
        numberObject.init();
        handler.question();
        mathPlayHistory.init();
    },
};

App.init();


// questionObject: {}
// {
//     lowNum: 
//     highNum:
//     userAnswer:
//     mathOperation: // addition / subtractration / multiplication / division
// }

// history: [{},{},{},{}]
// and inside each {}
// {
//     lowNum: 
//     highNum:
//     userAnswer:      // can be null
//     mathOperation: // addition / subtractration / multiplication / division
// }

// MathPlayObject
// {
//     questionObject: {},
//     history: [{},{},{}];
// }