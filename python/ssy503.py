# File: ssy503.py
# Author(s) names AND netid's: Sameer Srivastava ssy503
# Date: 4/20/15

from random import *
from decimal import *
from copy import *
from MancalaBoard import *

# a constant
INFINITY = 1.0e400
start = 0.0
end = 0.0

class Player:
    """ A basic AI (or human) player """
    HUMAN = 0
    RANDOM = 1
    MINIMAX = 2
    ABPRUNE = 3
    CUSTOM = 4

    def __init__(self, playerNum, playerType, ply=0):
        """Initialize a Player with a playerNum (1 or 2), playerType (one of
        the constants such as HUMAN), and a ply (default is 0)."""
        self.num = playerNum
        self.opp = 2 - playerNum + 1
        self.type = playerType
        self.ply = ply

    def __repr__(self):
        """Returns a string representation of the Player."""
        return str(self.num)

    def minimaxMove(self, board, ply):
        """ Choose the best minimax move.  Returns (score, move) """
        move = -1
        score = -INFINITY
        turn = self
        for m in board.legalMoves(self):
            #for each legal move
            if ply == 0:
                #if we're at ply 0, we need to call our eval function & return
                return (self.score(board), m)
            if board.gameOver():
                return (-1, -1)  # Can't make a move, the game is over
            nb = deepcopy(board)
            #make a new board
            nb.makeMove(self, m)
            #try the move
            opp = Player(self.opp, self.type, self.ply)
            s = opp.minValue(nb, ply-1, turn)
            #and see what the opponent would do next
            if s > score:
                #if the result is better than our best score so far, save that move,score
                move = m
                score = s
        #return the best score and move so far
        return score, move

    def maxValue(self, board, ply, turn):
        """ Find the minimax value for the next move for this player
        at a given board configuation. Returns score."""
        if board.gameOver():
            return turn.score(board)
        score = -INFINITY
        for m in board.legalMoves(self):
            if ply == 0:
                #print "turn.score(board) in max value is: " + str(turn.score(board))
                return turn.score(board)
            # make a new player to play the other side
            opponent = Player(self.opp, self.type, self.ply)
            # Copy the board so that we don't ruin it
            nextBoard = deepcopy(board)
            nextBoard.makeMove(self, m)
            s = opponent.minValue(nextBoard, ply-1, turn)
            #print "s in maxValue is: " + str(s)
            if s > score:
                score = s
        return score

    def minValue(self, board, ply, turn):
        """ Find the minimax value for the next move for this player
            at a given board configuation. Returns score."""
        if board.gameOver():
            return turn.score(board)
        score = INFINITY
        for m in board.legalMoves(self):
            if ply == 0:
                #print "turn.score(board) in min Value is: " + str(turn.score(board))
                return turn.score(board)
            # make a new player to play the other side
            opponent = Player(self.opp, self.type, self.ply)
            # Copy the board so that we don't ruin it
            nextBoard = deepcopy(board)
            nextBoard.makeMove(self, m)
            s = opponent.maxValue(nextBoard, ply-1, turn)
            #print "s in minValue is: " + str(s)
            if s < score:
                score = s
        return score


    # The default player defines a very simple score function
    # You will write the score function in the MancalaPlayer below
    # to improve on this function.
    def score(self, board):
        """ Returns the score for this player given the state of the board """
        if board.hasWon(self.num):
            return 100.0
        elif board.hasWon(self.opp):
            return 0.0
        else:
            return 50.0

    # You should not modify anything before this point.
    # The code you will add to this file appears below this line.

    # You will write this function (and any helpers you need)
    # You should write the function here in its simplest form:
    #   1. Use ply to determine when to stop (when ply == 0)
    #   2. Search the moves in the order they are returned from the board's
    #       legalMoves function.
    # However, for your custom player, you may copy this function
    # and modify it so that it uses a different termination condition
    # and/or a different move search order.
    def alphaBetaMove(self, board, ply):
        """ Choose a move with alpha beta pruning.  Returns (score, move) """
        alpha = -INFINITY
        beta = INFINITY
        return self.alphaMaxValue(board, ply, self, alpha, beta)


    def alphaMaxValue(self, board, ply, turn, alpha, beta):
        """ Find the alphamax value for the next move for this player
        at a given board configuation. Returns score, move."""
        if board.gameOver() or ply == 0 or abs(board.scoreCups[0] - board.scoreCups[1]) > 24:
            return turn.score(board), -1
        score = -INFINITY
        move = -1
        #print 'alpha: ' + str(alpha)
        for m in board.legalMoves(self):
            # make a new player to play the other side
            opponent = Player(self.opp, self.type, self.ply)
            # Copy the board so that we don't ruin it
            nextBoard = deepcopy(board)
            again = nextBoard.makeMove(self, m)
            #Make the next move
            if again:
                s, mv = self.alphaMaxValue(nextBoard, ply - 1, turn, alpha, beta)
            else:
                s, mv = opponent.alphaMinValue(nextBoard, ply-1, turn, alpha, beta)
            #If this state is greater then store that in score
            if s > score:
                score = s
                move = m
            #If score is greater than or equal to beta return score
            if score >= beta:
                return score, move
            #if score is greater than alpha, make alpha score
            if score > alpha:
                alpha = score
        return score, move

    def alphaMinValue(self, board, ply, turn, alpha, beta):
        """ Find the alphamin value for the next move for this player
            at a given board configuation. Returns score,move."""
        if board.gameOver() or ply == 0 or abs(board.scoreCups[0] - board.scoreCups[1]) > 24:
            return turn.score(board), -1
        score = INFINITY
        move = -1
        for m in board.legalMoves(self):
            # make a new player to play the other side
            opponent = Player(self.opp, self.type, self.ply)
            # Copy the board so that we don't ruin it
            nextBoard = deepcopy(board)
            again = nextBoard.makeMove(self, m)
            if again:
                s, mv = self.alphaMinValue(nextBoard, ply - 1, turn, alpha, beta)
            else:
                #Make the next move
                s, mv = opponent.alphaMaxValue(nextBoard, ply-1, turn, alpha, beta)
            #If this state is less then store that in score
            if s < score:
                score = s
                move = m
            #If score is less than or equal to alpha return score
            if score <= alpha:
                return score, move
            #if score is less than beta, make beta score
            if score < beta:
                beta = score
        return score, move


    def chooseMove(self, board):
        """ Returns the next move that this player wants to make """
        if self.type == self.HUMAN:
            move = input("Please enter your move:")
            while not board.legalMove(self, move):
                print move, "is not valid"
                move = input( "Please enter your move" )
            return move
        elif self.type == self.RANDOM:
            move = choice(board.legalMoves(self))
            print "chose move", move
            return move
        elif self.type == self.MINIMAX:
            val, move = self.minimaxMove(board, self.ply)
            print "chose move", move, " with value", val
            return move
        elif self.type == self.ABPRUNE:
            val, move = self.alphaBetaMove(board, self.ply)
            print "chose move", move, " with value", val
            return move
        elif self.type == self.CUSTOM:
            val, move = self.alphaBetaMove(board, 9)
            return move
        else:
            print "Unknown player type"
            return -1


# Note, you should change the name of this player to be your netid
class ssy503(Player):
    """ Defines a player that knows how to evaluate a Mancala gameboard
        intelligently """

    def score(self, board):
        """ Evaluate the Mancala board for this player """
        if board.hasWon(self.num):
            return 1000.0
        elif board.hasWon(self.opp):
            return -1000.0
        elif board.scoreCups[self.num - 1] > 24:
            return 500
        elif board.scoreCups[self.opp - 1] > 24:
            return -500
        else:
            #Get the cups first
            if(self.num == 1):
                cups = board.P1Cups
                oppCups = board.P2Cups
                scoreDiff = board.scoreCups[0] - board.scoreCups[1]
            else:
                cups = board.P2Cups
                oppCups = board.P1Cups
                scoreDiff = board.scoreCups[1] - board.scoreCups[0]
            '''
            #Check if the score is better
            score = (scoreDiff + 36) * 10 / 6
            #Capture Protection
            captureProtection = 0.0
            #Check additional (30)
            additional = 0.0
            hasAdditional = False
            for i in range(len(cups) - 1, -1, -1):
                if (not hasAdditional) and (cups[i] % 13) == (6 - i): #if it can have an additional turn
                    additional = (80.0 * (i + 1))/6
                    hasAdditional = True
                if(oppCups[i] != 0):
                    captureProtection += 10
            #Check if right is cleared (20)
            clearRight = 0.0
            if cups[5] == 0:
                clearRight = 30
            total = additional + clearRight + score + captureProtection
            '''
            score = scoreDiff + 24 * 30 / 6
            # print "score: ", score
            additional = 0.0
            capturing = 0.0
            marbles = 0.0
            for i in range(len(cups)):
                numMarbles = cups[i]
                if numMarbles > 0 or oppCups[i] > 0:
                    if numMarbles == (6 - i):
                        additional = (50.0 * (i + 1))/6
                    #Capturing
                    temp = oppCups[i] % 13
                    temp_capturing = 0.0
                    ownMarbles = -1
                    if temp <= (5 - i): #Stones will lands on cups[i+temp]
                        if temp == 0: #Lands back on same space
                            ownMarbles = cups[5 - i]
                        else:
                            ownMarbles = cups[5 - i - temp]
                    elif temp >= (13 - i):
                        ownMarbles = cups[5 - i + temp - 13]
                    #Calculate capturing
                    if ownMarbles == 0:
                        temp_capturing = 50.0
                    elif ownMarbles == 1:
                        temp_capturing = 40.0
                    elif ownMarbles == 2:
                        temp_capturing = 50 / ownMarbles
                    if temp_capturing > capturing:
                        capturing = temp_capturing
                    #Marbles
                    if numMarbles < 4:
                        marbles += 5
                else:
                    if i == 5:
                        marbles += 30
                    else:
                        marbles += 10
            # print "additional: ", additional
            # print "capturing: ", capturing
            total = capturing + score + additional + marbles
            #total = score + additional + marbles
            return total


