
/**
**	Collection of useful easing functions (imported from Cherry source code).
*/

const Easing =
{
	/**
	**	Interpolates numeric values between two objects (`src` and `dst`) using the specified `duration` (in seconds) and `easing` function. Note that all four parameters
	**	`src`, `dst`, `duration` and `easing` must be objects having the same number of values.
	*/
	interpolate: function (src, dst, duration, easing, callback/* function(data, isFinished) */)
	{
		let time = { };
		let data = { };
		let count = 0;

		for (let x in src)
		{
			time[x] = 0.0;
			data[x] = src[x]
			count++;
		}

		let lastTime = Date.now()/1000;
		let dt = 0;

		let interpolator = function()
		{
			let curTime = Date.now()/1000;
			dt = curTime - lastTime;
			lastTime = curTime;

			for (let x in time)
			{
				if (time[x] == duration[x])
					continue;

				time[x] += dt;
				if (time[x] >= duration[x])
				{
					time[x] = duration[x];
					count--;
				}

				let t = easing[x] (time[x] / duration[x]);
				data[x] = (1-t)*src[x] + t*dst[x];
			}

			callback (data, count == 0);

			if (count != 0)
				requestAnimationFrame(interpolator);
		};

		interpolator();
	},

	/* ******************************************** */
	Linear:
	{
		IN: function (t)
		{
			return t;
		},

		OUT: function (t)
		{
			return t;
		},

		IN_OUT: function (t)
		{
			return t;
		}
	},

	/* ******************************************** */
	Back:
	{
		k: 1.70158,

		IN: function (t, k)
		{
			if (k === undefined) k = Easing.Back.k;
			return t*t*((k+1)*t - k);
		},

		OUT: function (t, k)
		{
			return 1 - Easing.Back.IN(1 - t, k);
		},

		IN_OUT: function (t, k)
		{
			if (t < 0.5)
				return Easing.Back.IN(t*2, k)/2;
			else
				return Easing.Back.OUT((t-0.5)*2, k)/2 + 0.5;
		}
	},

	/* ******************************************** */
	Bounce:
	{
		getConst: function (t)
		{
			if (t < 1.0/2.75)
				return 7.5625 * t * t;
			else if (t < 2.0/2.75)
				return 7.5625 * (t -= 1.5/2.75)*t + 0.75;
			else if (t < 2.5/2.75)
				return 7.5625 * (t -= 2.250/2.75) * t + 0.9375;

			return 7.5625 * (t -= 2.625/2.75) * t + 0.984375;
		},

		IN: function (t)
		{
			return 1 - Easing.Bounce.getConst(1-t);
		},

		OUT: function (t)
		{
			return Easing.Bounce.getConst(t);
		},

		IN_OUT: function (t)
		{
			if (t < 0.5)
				return (1 - Easing.Bounce.getConst(1-2*t))/2;
			else
				return (Easing.Bounce.getConst((t-0.5)*2)/2)+0.5;
		}
	},

	/* ******************************************** */
	Circ:
	{
		IN: function (t)
		{
			return 1 - Math.sqrt(1 - t*t);
		},

		OUT: function (t)
		{
			return 1 - Easing.Circ.IN(1 - t);
		},

		IN_OUT: function (t)
		{
			if (t < 0.5)
					return Easing.Circ.IN(t*2)/2;
				else
					return Easing.Circ.OUT((t-0.5)*2)/2 + 0.5;
		}
	},

	/* ******************************************** */
	Cubic:
	{
		IN: function (t)
		{
			return t*t*t;
		},

		OUT: function (t)
		{
			return 1 - Easing.Cubic.IN(1 - t);
		},

		IN_OUT: function (t)
		{
			if (t < 0.5)
				return Easing.Cubic.IN(t*2)/2;
			else
				return Easing.Cubic.OUT((t-0.5)*2)/2 + 0.5;
		}
	},

	/* ******************************************** */
	Expo:
	{
		IN: function (t)
		{
			return Math.pow(2, 12*(t-1));
		},

		OUT: function (t)
		{
			return -Math.pow(2, -12*t) + 1;
		},

		IN_OUT: function (t)
		{
			if ((t *= 2) < 1)
				return Math.pow (2, 12 * (t - 1)) / 2;
			else
				return (-Math.pow (2, -12 * (t - 1)) + 2) / 2;
		}
	},

	/* ******************************************** */
	Power:
	{
		p: 12,

		IN: function (t)
		{
			return Math.pow(t, Easing.Power.p);
		},

		OUT: function (t)
		{
			return 1 - Easing.Power.IN(1 - t);
		},

		IN_OUT: function (t)
		{
			if (t < 0.5)
				return Easing.Power.IN(t*2)/2;
			else
				return Easing.Power.OUT((t-0.5)*2)/2 + 0.5;
		}
	},

	/* ******************************************** */
	Quad:
	{
		IN: function (t)
		{
			return t*t;
		},

		OUT: function (t)
		{
			return 1 - Easing.Quad.IN(1 - t);
		},

		IN_OUT: function (t)
		{
			if (t < 0.5)
				return Easing.Quad.IN(t*2)/2;
			else
				return Easing.Quad.OUT((t-0.5)*2)/2 + 0.5;
		}
	},

	/* ******************************************** */
	Quartic:
	{
		IN: function (t)
		{
			return t*t*t*t;
		},

		OUT: function (t)
		{
			return 1 - Easing.Quartic.IN(1 - t);
		},

		IN_OUT: function (t)
		{
			if (t < 0.5)
				return Easing.Quartic.IN(t*2)/2;
			else
				return Easing.Quartic.OUT((t-0.5)*2)/2 + 0.5;
		}
	},

	/* ******************************************** */
	Quintic:
	{
		IN: function (t)
		{
			return t*t*t*t*t;
		},

		OUT: function (t)
		{
			return 1 - Easing.Quintic.IN(1 - t);
		},

		IN_OUT: function (t)
		{
			if (t < 0.5)
					return Easing.Quintic.IN(t*2)/2;
				else
					return Easing.Quintic.OUT((t-0.5)*2)/2 + 0.5;
		}
	},

	/* ******************************************** */
	Sine:
	{
		IN: function (t)
		{
			return 1 - Math.sin (1.5708 * (1 - t));
		},

		OUT: function (t)
		{
			return Math.sin (1.5708 * t);
		},

		IN_OUT: function (t)
		{
			return (Math.cos (3.1416*t) - 1) / -2;
		}
	},

	/* ******************************************** */
	Step:
	{
		IN: function (t)
		{
			return t != 1.0 ? 0 : 1.0;
		},

		OUT: function (t)
		{
			return t != 1.0 ? 0 : 1.0;
		},

		IN_OUT: function (t)
		{
			return t != 1.0 ? 0 : 1.0;
		}
	}
};

export default Easing;
