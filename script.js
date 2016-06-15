// ==UserScript==
// @name         Contract Hire and Leasing Calculator
// @namespace    http://your.homepage/
// @version      0.2
// @description  enter something useful
// @author       You
// @match        http://www.contracthireandleasing.com/personal/*
// @grant        none
// ==/UserScript==

$('#alldeals .deal').each(function(i) {
    var $deal = $(this);
    
    // price calc
    var monthlyPrice = $deal.find('.deal-price').text().replace('£', '').replace(',', '');
    var initialPayment = parseFloat($deal.find('.deal-user').text().replace('£', '').replace(',', ''));
    var profileText = $deal.find('.deal-profile').text();
    
    var monthRegex = /\d+\+(\d+)/gi;
    var monthMatches = monthRegex.exec(profileText);
    var months = parseInt(monthMatches[1]);
    var years = (months + 1) / 12;
    
    var totalCost = ((monthlyPrice * months) + initialPayment).toFixed(2);
    var yearlyCost = (totalCost / years).toFixed(2);
        
    // ui
    var $modelDesc = $deal.find('.deal-model-description');
    $modelDesc.next('div').appendTo($modelDesc);
    $modelDesc.find('.deal-personal').hide();
    
    var $costDiv = $('<div />', { 'class': 'overall-cost' }).css({
        'float': 'right',
        'width': '250px',
        'text-align': 'right',
        'padding': '0 10px 5px 0'
    });
    $('.all-price-wrap').css({
        'clear': 'both',
        'padding': '0 10px 10px 0'
    });
    
    // yearly cost...
    $('<p />', { text: '£' + numberWithCommas(yearlyCost) + ' / yr' }).css({
        'font': '28px/normal "museo_sans700",Gotham,"Helvetica Neue",Helvetica,Arial,sans-serif',
        'padding': 0
    }).appendTo($costDiv);
    
    // total cost...
    $('<p />', { text: '£' + numberWithCommas(totalCost) + ' total'}).css({
        'font': '20px/normal "museo_sans700",Gotham,"Helvetica Neue",Helvetica,Arial,sans-serif',
        'padding': 0
    }).appendTo($costDiv);
    
    $deal.data('yearly-cost', yearlyCost).prepend($costDiv);
}).sort(function(a, b) {
    return $(a).data('yearly-cost') - $(b).data('yearly-cost');
}).appendTo('#alldeals')

// get rid of the crap
$('.manufacturer-banner, #ootwWindow, .right-panel, .leaderboard-wrap, .deal-panel h2, .crosslinks, .inline-srb-wrap, footer').hide();
$('.content').css({
    'margin-top': 0,
    'padding': '5px 3%'
});
$('#btnClose').css({
    'top': '33px',
    'right': 0,
    'border-left': '5px solid #FFF'
});

// move search buttons
$('.search-button-wrap').css({
    'width': '25%',
    'float': 'right',
    'position': 'relative',
    'padding': 0
}).appendTo('.adv-hold');
$('.keywords-wrap').css({
    'width': '74%',
    'float': 'left',
    'margin': 0
});
$('.adv-options').css({
    'padding': 0
});

// style the deals
$('#alldeals .deal').css({
    'color': '#333',
    'background-color': 'transparent'
}).first().css({
    'color': '#080',
    'background-color': '#ecffef'
}).find('.deal-table').css('background-color', 'transparent');

// copy pagination to the top
$('.pagination.posts').clone(true).prependTo('#alldeals');

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
