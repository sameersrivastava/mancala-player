execfile("TicTacToe.py")
t = TTTBoard()
t.hostGame(Player(1, Player.RANDOM), Player(2, Player.ABPRUNE, 9))