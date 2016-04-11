var yo = require('yo-yo');
var dialogPolyfill = require('dialog-polyfill');
var Achievement = require('./achievement');

module.exports = AchievementViewer;

function AchievementViewer(list, parentEl) {
    var self = this;

    this.achievements = list.map(function(item) {
        var achievement = new Achievement(item.id, item.opts);
        achievement.on('achievement::unlocked', function(e) {
            update();
        });
        return achievement;
    });

    var el = render(this.achievements);
    el.querySelector('.close').addEventListener('click', function() {
        el.close();
    });
    if (!el.showModal) dialogPolyfill.registerDialog(el);
    parentEl.appendChild(el);

    this.el = function() {
        return el;
    };

    function update() {
        var newEl = render(self.achievements);
        yo.update(el, newEl);
    };

    function render(achievements) {
        return yo`
<dialog class="achievement-dialog mdl-dialog">
<h4 class="mdl-dialog__title">Achievements</h4>
<div class="mdl-dialog__content">
${gridify(achievements, 3).map(function(card) {
return card;
})}
</div>
<div class="mdl-dialog__actions">
<button type="button" class="mdl-button close">Close</button>
</div>
</dialog>`;
    };

    function gridify(array, chunkSize) {
        var grids = [];
        var unlockedCards = array.filter(function(item) {
            return item.isUnlocked();
        });

        unlockedCards.map(function(n, i) {
            if (i%chunkSize === 0) {
                grids.push(unlockedCards.slice(i, i+chunkSize));
            }
        });
        var el = grids.map(function(cards) {
            return yo`
<div class="mdl-grid">
${cards.map(function(card) {
return cardify(card);
})}
</div>
`;
        });
        return el;
    }

    function cardify(achievement) {
        return yo`
<div class="achievement-card mdl-cell mdl-cell-4-col mdl-card mdl-shadow--4dp">
<div class="mdl-card__title">
<h2 class="mdl-card__title-text">${achievement.opts.title}</h2>
</div>
<div class="mdl-card__supporting-text">
${achievement.opts.subtitle}
</div>
</div>
`;

    }
}

AchievementViewer.prototype.checkAchievements = function() {
    this.achievements.forEach(function(achievement) {
        achievement.unlock(function(done) {
            return;
        });
    });
};