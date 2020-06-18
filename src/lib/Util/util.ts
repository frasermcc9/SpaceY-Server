export class util {
	public static hashCode(str: string): number {
		var hash = 0,
			i,
			chr;
		for (i = 0; i < str.length; i++) {
			chr = str.charCodeAt(i);
			hash = (hash << 5) - hash + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}

	public static seededRandom(min: number, max: number, seed: number) {
		max = max || 1;
		min = min || 0;
		seed = (seed * 9301 + 49297) % 233280;
		var rnd = seed / 233280;
		return min + rnd * (max - min);
	}

	/**
	 * Generates a random number between min and max (inclusive)
	 * @param min minimum number
	 * @param max maximum number
	 */
	public static randBetween(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	public static chooseFrom<T>(arr: T[]): { item: T; index: number } {
		let i = Math.floor(Math.random() * arr.length);
		var a = {
			item: arr[i],
			index: i,
		};
		return a;
	}

	public static chooseFromSeeded<T>(arr: T[], seed: number): { item: T; index: number } {
		seed = Math.abs(seed);
		let i = Math.round(this.seededRandom(0, arr.length - 1, seed));
		var a = {
			item: arr[i],
			index: i,
		};
		return a;
	}
}
