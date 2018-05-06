export function calculatePoint(goalHome, goalAway, betGoalHome, betGoalAway){
    goalHome = parseInt(goalHome);
    goalAway = parseInt(goalAway);
    betGoalHome = parseInt(betGoalHome);
    betGoalAway = parseInt(betGoalAway);

    if (goalHome == betGoalHome && goalAway == betGoalAway){
        return 3;
    }

    const differenceGoals = goalHome - goalAway;
    const differenceBet = betGoalHome - betGoalAway;


    if (differenceGoals == differenceBet || (differenceGoals > 0) && (differenceBet > 0) || (differenceGoals < 0) && (differenceBet < 0)) {
        return 1;
    } 

    return 0;
}