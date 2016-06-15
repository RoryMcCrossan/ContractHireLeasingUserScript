// ==UserScript==
// @name         Contract Hire and Leasing Calculator
// @namespace    http://rorymccrossan.co.uk
// @version      1.0
// @description  Adds helpful information to each deal
// @author       Rory McCrossan
// @match        http://www.contracthireandleasing.com/personal/*
// @match        http://www.contracthireandleasing.com/business/*
// @grant        none
// ==/UserScript==

function toFloat(x) {
    return parseFloat(x.replace(/[^0-9\.]+/g,""));
}

function groupNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$('<style />', {
    text: '.overall-cost { text-align: right; padding: 0; position: absolute; top: 0; left: 0; right: 0; background-color: #DDD; }' + 
    '.deal .title-wrap { padding: 0 0 0 10px; }' + 
    '.all-price-wrap { padding: 0 10px 10px 0 }' + 
    'ul.amortised li { list-style: inherit; display: inline-block; position: relative; padding-left: 15px; text-align: left; margin: 0 5px 0 15px; }' + 
    'ul.amortised li:before { position: absolute; left: 0; content: "\u25b6"; }' +
    '.manufacturer-banner, #ootwWindow, .right-panel, .leaderboard-wrap, .deal-panel h2, .crosslinks, .inline-srb-wrap, footer { display: none; }' + 
    '.content { margin-top: 0; padding: 5px 3%; }' + 
    '#btnClose { top: 33px; right: 0; border-left: 5px solid #FFF }' + 
    '.deal-panel .listing-text { width: 50%; float: left; padding: 7px 0; }' + 
    '.pagination.posts { width: 50%; clear: none; padding: 0 0 10px; margin: 0;}' +
    '.search-button-wrap { width: 25%; float: right; position: relative; padding: 0 }' +
    '.keywords-wrap { width: 75%; float: left; margin: 0 }' + 
    '.adv-options { padding: 0 }' +
    '#alldeals .deal { color: #333; background-color: transparent; border: 1px solid #DDD; padding-top: 30px; }' +
    '#alldeals .deal:first-child { color: #080; background-color: #ecffef; border-color: #88E886; }' + 
    '#alldeals .deal:first-child .deal-table { background-color: transparent }' + 
    '#alldeals .deal:first-child ul.amortised li { font-weight: bold; }' + 
    '#alldeals .deal:first-child .overall-cost { background-color: #88E886; }'
}).appendTo('head');

$('.pagination.posts').clone(true).insertAfter('.listing-text');
$('.search-button-wrap').appendTo('.adv-hold');
$('<div class="deal-container"></div>').appendTo('#alldeals');

$('#alldeals .deal').each(function(i) {
    var $deal = $(this);
    
    // price calc
    var monthlyPrice = $deal.find('.deal-price').text().replace('£', '').replace(',', '');
    var initialPayment = parseFloat($deal.find('.deal-user').text().replace('£', '').replace(',', ''));
    var profileText = $deal.find('.deal-profile').text();
        
    var monthRegex = /(\d+)\+(\d+)/gi;
    var monthMatches = monthRegex.exec(profileText);
    
    if (isNaN(initialPayment)) {
        initialPayment = monthMatches[1] * monthlyPrice;
    }            
    
    var months = parseInt(monthMatches[2]);
    var years = (months + 1) / 12;
    
    var totalCost = ((monthlyPrice * months) + initialPayment).toFixed(2);
    var yearlyCost = (totalCost / years).toFixed(2);
    var $costDiv = $('<div class="overall-cost" />');
    
    var $amortisedData = $('<ul class="amortised" />').appendTo($costDiv);
    $('<li />', { 
        text: '£' + groupNumber((yearlyCost / 12).toFixed(2)) + ' / mo',
        class: 'monthly'
    }).prependTo($amortisedData);
    $('<li />', { 
        text: '£' + groupNumber(yearlyCost) + ' / yr', 
        class: 'yearly'
    }).prependTo($amortisedData);
    $('<li />', { 
        text: '£' + groupNumber(totalCost) + ' total',
        class: 'total'
    }).prependTo($amortisedData);
    
    $deal.data('yearly-cost', yearlyCost).prepend($costDiv);
}).sort(function(a, b) {
    return $(a).data('yearly-cost') - $(b).data('yearly-cost');
}).appendTo('.deal-container');
