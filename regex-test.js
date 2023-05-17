import { hostRegExp, matchDomainCnames } from './lib.js';

const testValues = [
	"Host(`example.local`)",
	"Host(`foo.example.local`) || Host(`bar.example.local`)",
	"HOST(`foo.example.local`) || ( Host(`baz.example.local`) && Path(`/baz`) )",
	"Host(`bill.example.local`) || ( Path(`/ben`) && Host(`ben.example.local`) )",
	"Host( `foo.local`, `bar.local`)",
	"Host(`example.com`)",
	"Host(`foo.example.com`) || Host(`bar.example.local`)",
	"HOST(`foo.example.local`) || ( Host(`baz.example.com`) && Path(`/baz`) )",
	"Host(`bill.example.com`) || ( Path(`/ben`) && Host(`ben.example.local`) )",
	"Host( `foo.com`, `bar.local`)"
]

testValues.forEach( l => {
	if (hostRegExp.test(l)) {
		hostRegExp.lastIndex = 0
		console.log(matchDomainCnames(l))
	} else {
		console.log("no match - " + l )
	}
})
