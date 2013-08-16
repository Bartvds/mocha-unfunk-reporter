module unfunk {

	export module stream {

		export class StreamBuffer {

			public buffer:any[] = [];
			public handle:Function;
			private _running:bool = false;

			constructor(public stream:WritableStream, start?:bool = true) {

				var self:StreamBuffer = this;
				this.handle = (data) => {
					self.buffer.push(data);
				};
				if (start) {
					this.start();
				}
			}

			start() {
				if (!this._running) {
					this._running = true;
					this.stream.addListener('data', this.handle);
				}
			}

			peek() {
				return this.buffer.join('');
			}

			get() {
				var data = this.buffer.join('');
				this.buffer = [];
				return data;
			}

			clear() {
				this.buffer = [];
			}

			stop() {
				var data = this.get();
				if (this._running) {
					this._running = false;
					this.stream.removeListener('data', this.handle);
				}
				return data;
			}
		}
	}
}