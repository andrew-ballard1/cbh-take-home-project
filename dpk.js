const crypto = require("crypto");

/*
I guess we'll start the notes here, before refactoring anything

1. Null, undefined, NaN, all trigger a 0 partition key return
2. Sending an object with property partitionKey will return the provided value, unless its longer than MAX_PARTITION_KEY_LENGTH
3. Speaking of max length, the max is set to 256 but the function returns 128.
4. Even weirder, the RFC specification for UUID says to use 36 characters, separated by 4 dashes. 40 characters for a non-deterministic id. Makes it seem like 128 is overkill for something deterministic, but the prompt says not to change functionality.

Post mortem comments / explanation:

I would change the function to also return '0' for falsy partitionKey values, not just for falsy event parameters.

I think coming at this from the perspective that "were going to return '0' unless we hit specific criteria" is easier to read than trying to figure out what you've got and applying changes if they're necessary.

We can remove nearly half of the logic and re-definitions just by preceding with if(!event). Similarly, by using the nullish operator we can also reduce a bunch of logic down to if(!candidate)
I also added the stringify call, though maybe it's not "clean" to call a method on a variable as a parameter in a chained call. That was a mouthful.

The only case left after the two if nots is whether or not the provided key is too long, in which case we rehash and return, or return the candidate we've already created.

*/


// These don't need to be in the export
// initially I removed the TRIVIAL_PARTITION_KEY but I think I'll move it outside the export as well. Maybe this function lives in an environment that these get passed to.
const TRIVIAL_PARTITION_KEY = '0'
const MAX_PARTITION_KEY_LENGTH = 256

exports.deterministicPartitionKey = (event) => {
	let candidate = event?.partitionKey

	// if we get a falsy value, return string '0'
	if (!event) {
		return TRIVIAL_PARTITION_KEY
	}

	// if we don't get a truthy value for partitionKey, generate a candidate id 
	// this is equivalent to the existing functionality: passing falsy values in through { partitionKey: ____ } still generates an id while just passing falsy for event would return '0'
	if (!candidate) {
		candidate = crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex")
	}

	// if partitionKey is too long, rehash and make it shorter
	return candidate.length > MAX_PARTITION_KEY_LENGTH ? crypto.createHash("sha3-512").update(candidate).digest("hex") : candidate
}
