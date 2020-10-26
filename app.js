$(document).ready(function() {


    var character = {

        "Brick": {
            name: "Brick",
            hp: 80,
            atk: 8,
            shld: 6,
            imgUrl: "/assets/images/St Matt.jpg"
        },
        "Mordicai": {
            name: "Mordicai",
            hp: 40,
            atk: 8,
            shld: 3,
            imgUrl: "/assets/images/St Matt.jpg"
        },
        "Roland": {
            name: "Roland",
            hp: 65,
            atk: 8,
            shld: 5,
            imgUrl: "/assets/images/St Matt.jpg"
        },
        "Lilith": {
            name: "Lilith",
            hp: 50,
            atk: 8,
            shld: 4,
            imgUrl: "/assets/images/St Matt.jpg"
        }
    };

    var attacker;

    var combatants = [];

    var defender;

    var turnCounter = 1;

    var killCount = 0;


    /*------Character Card ------*/

    var renderCharacter = function(character, renderArea) {

        var charDiv = $("<div class='character' dataName='" + character.name + "'>");
        var charName = $("<div class='characterName'>").text(character.name);
        var charImage = $("<img alt='image' class='characterImage'>").attr("src", character.imgUrl);
        var charHealth = $("<div class='charHealth'>").text(character.hp);

        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);

    };

    var startGame = function() {

        for (var key in characters) {
            renderCharacter(character[key], "#battlerSelect");
        }

        startGame();



    }

    // This function handles updating the selected player or the current defender. If there is no selected player/defender this
    // function will also place the character based on the areaRender chosen (e.g. #selected-character or #defender)
    var updateCharacter = function(charObj, areaRender) {
        // First we empty the area so that we can re-render the new object
        $(areaRender).empty();
        renderCharacter(charObj, areaRender);
    };

    // This function will render the available-to-attack enemies. This should be run once after a character has been selected
    var renderEnemies = function(enemyArr) {
        for (var i = 0; i < enemyArr.length; i++) {
            renderCharacter(enemyArr[i], "#battlerLobby");
        }
    };

    // Function to handle rendering game messages.
    var renderMessage = function(message) {
        // Builds the message and appends it to the page.
        var gameMessageSet = $("#gameMessage");
        var newMessage = $("<div>").text(message);
        gameMessageSet.append(newMessage);
    };

    // Function which handles restarting the game after victory or defeat.
    var restartGame = function(resultMessage) {
        // When the 'Restart' button is clicked, reload the page.
        var restart = $("<button>Restart</button>").click(function() {
            location.reload();
        });

        // Build div that will display the victory/defeat message.
        var gameState = $("<div>").text(resultMessage);

        // Render the restart button and victory/defeat message to the page.
        $("body").append(gameState);
        $("body").append(restart);
    };

    // Function to clear the game message section
    var clearMessage = function() {
        var gameMessage = $("#gameMessage");

        gameMessage.text("");
    };

    // ===================================================================

    // On click event for selecting our character.
    $("#battlerSelect").on("click", ".character", function() {
        // Saving the clicked character's name.
        var name = $(this).attr("dataName");

        // If a player character has not yet been chosen...
        if (!attacker) {
            // We populate attacker with the selected character's information.
            attacker = characters[name];
            // We then loop through the remaining characters and push them to the combatants array.
            for (var key in characters) {
                if (key !== name) {
                    combatants.push(characters[key]);
                }
            }

            // Hide the character select div.
            $("#battlerSelect").hide();

            // Then render our selected character and our combatants.
            updateCharacter(attacker, "#battler");
            renderEnemies(combatants);
        }
    });

    // Creates an on click event for each enemy.
    $("#battleesLobby").on("click", ".character", function() {
        // Saving the opponent's name.
        var name = $(this).attr("dataName");

        // If there is no defender, the clicked enemy will become the defender.
        if ($("#battlee").children().length === 0) {
            defender = characters[name];
            updateCharacter(defender, "#battlee");

            // remove element as it will now be a new defender
            $(this).remove();
            clearMessage();
        }
    });

    // When you click the attack button, run the following game logic...
    $("#attackButton").on("click", function() {
        // If there is a defender, combat will occur.
        if ($("#battlee").children().length !== 0) {
            // Creates messages for our attack and our opponents counter attack.
            var attackMessage = "You attacked " + defender.name + " for " + attacker.attack * turnCounter + " damage.";
            var counterAttackMessage = defender.name + " attacked you back for " + defender.enemyAttackBack + " damage.";
            clearMessage();

            // Reduce defender's health by your attack value.
            defender.health -= attacker.attack * turnCounter;

            // If the enemy still has health..
            if (defender.health > 0) {
                // Render the enemy's updated character card.
                updateCharacter(defender, "#battlee");

                // Render the combat messages.
                renderMessage(attackMessage);
                renderMessage(counterAttackMessage);

                // Reduce your health by the opponent's attack value.
                attacker.health -= defender.enemyAttackBack;

                // Render the player's updated character card.
                updateCharacter(attacker, "#battler");

                // If you have less than zero health the game ends.
                // We call the restartGame function to allow the user to restart the game and play again.
                if (attacker.health <= 0) {
                    clearMessage();
                    restartGame("You have been defeated...GAME OVER!!!");
                    $("#attackButton").off("click");
                }
            } else {
                // If the enemy has less than zero health they are defeated.
                // Remove your opponent's character card.
                $("#battlee").empty();

                var gameStateMessage = "You have defeated " + defender.name + ", you can choose to fight another enemy.";
                renderMessage(gameStateMessage);

                // Increment your kill count.
                killCount++;

                // If you have killed all of your opponents you win.
                // Call the restartGame function to allow the user to restart the game and play again.
                if (killCount >= combatants.length) {
                    clearMessage();
                    $("#attackButton").off("click");
                    restartGame("You Won!!!! GAME OVER!!!");
                }
            }
            // Increment turn counter. This is used for determining how much damage the player does.
            turnCounter++;
        } else {
            // If there is no defender, render an error message.
            clearMessage();
            renderMessage("No enemy here.");
        }
    });
});