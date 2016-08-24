window.gameData.SnakeBlock = 

		function SnakeBlock(enabled, direction){
			this.enabled = enabled;
			this.direction = direction;

			this.delete = function(){
				this.enabled = false;
			};
			this.create = function(direction){
				this.enabled = true;
				this.direction = direction;
			};
			this.toString = function(){
				return this.enabled ? "1" : "0";
			};
		};