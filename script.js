let expenses = [];
let totalAmount = 0;
let myChart; 

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expnese-table-body');
const totalAmountCell = document.getElementById('total-amount');
const expenseChart = document.getElementById('expense-chart'); 

addBtn.addEventListener('click', function() {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = new Date(dateInput.value); 

    
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    if (category === '') {
        alert('Please select a category');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (date === '') {
        alert('Please select a date');
        return;
    }
    
    if (date > today) {
        alert('Cannot add expenses for dates in the future. Please select a date that is today or in the past.');
        return;
    }

    expenses.push({ category, amount, date });

    totalAmount += amount;
    totalAmountCell.textContent = totalAmount;

    const newRow = expensesTableBody.insertRow();

    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();
    const deleteBtn = document.createElement('button');

    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function() {
        const index = expenses.findIndex(expense => expense === rowExpense);
        if (index !== -1) {
            const deletedExpense = expenses.splice(index, 1)[0];
            totalAmount -= deletedExpense.amount;
            totalAmountCell.textContent = totalAmount;
            expensesTableBody.removeChild(newRow);
            updateChart();
        }
    });

    const rowExpense = expenses[expenses.length - 1];
    categoryCell.textContent = rowExpense.category;
    amountCell.textContent = rowExpense.amount;
    dateCell.textContent = rowExpense.date.toLocaleDateString(); 
    deleteCell.appendChild(deleteBtn);

    updateChart();
});

function updateChart() {
    if (myChart) {
        myChart.destroy(); 
    }

    const ctx = expenseChart.getContext('2d');

    expenseChart.width = 10; 
    expenseChart.height = 10; 

   
    const categories = expenses.map(expense => expense.category);
    const uniqueCategories = Array.from(new Set(categories)); 
    const categoryTotalAmounts = {};

    expenses.forEach(expense => {
        if (categoryTotalAmounts[expense.category]) {
            categoryTotalAmounts[expense.category] += expense.amount;
        } else {
            categoryTotalAmounts[expense.category] = expense.amount;
        }
    });

    const colors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)'
    ];

    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: uniqueCategories,
            datasets: [{
                data: uniqueCategories.map(category => categoryTotalAmounts[category]),
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontSize: 12
                }
            },
            title: {
                display: true,
                text: 'Expense Distribution by Category',
                fontSize: 16,
                fontColor: '#333',
                fontStyle: 'bold'
            },
            cutoutPercentage: 10 
        }
    });
}
