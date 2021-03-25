import { assert, expect } from 'chai';
import { loadDescription } from './helper';
import { buildContractClass, VerifyError, buildTypeClasses } from '../src/contract';
import { Bool, Bytes, Int, OpCodeType, PrivKey, PubKey, Sig, Ripemd160, Sha1, Sha256, SigHashType, SigHashPreimage } from '../src';



const { ST1, AliasST2, ST3 } = buildTypeClasses(loadDescription('mdarray_desc.json'));

const { Block, Person, Token, Bsver } = buildTypeClasses(loadDescription('mixedstruct_desc.json'));


describe('toLiteral test', () => {

    describe('basic type', () => {

        it('basic type toLiteral test should success', () => {
            expect(new Int(11).toLiteral()).to.equal('11')
            expect(new Bool(true).toLiteral()).to.equal('true')
            expect(new Bytes("00af").toLiteral()).to.equal('b\'00af\'');
            expect(new PubKey("debc9a78563412000000").toLiteral()).to.equal('PubKey(b\'debc9a78563412000000\')');
            expect(new OpCodeType("01").toLiteral()).to.equal('OpCodeType(b\'01\')');
            expect(new PrivKey(0x123456789abcden).toLiteral()).to.equal('PrivKey(0x123456789abcde)');
            expect(new Sig("debc9a78563412000000").toLiteral()).to.equal('Sig(b\'debc9a78563412000000\')');
            expect(new Ripemd160("debc9a78563412000000").toLiteral()).to.equal('Ripemd160(b\'debc9a78563412000000\')');
            expect(new Sha1("debc9a78563412000000").toLiteral()).to.equal('Sha1(b\'debc9a78563412000000\')');
            expect(new Sha256("debc9a78563412000000").toLiteral()).to.equal('Sha256(b\'debc9a78563412000000\')');
            expect(new SigHashType(193).toLiteral()).to.equal('SigHashType(b\'c1\')');
            expect(new SigHashPreimage("debc9a78563412000000").toLiteral()).to.equal('SigHashPreimage(b\'debc9a78563412000000\')');
        })
    })


    describe('struct type', () => {

        it('struct type toLiteral test should success', () => {

            expect(new ST1({
                x: false,
                y: new Bytes("68656c6c6f20776f726c6421"),
                i: 1
            }).toLiteral()).to.equal('{false,b\'68656c6c6f20776f726c6421\',1}')


            expect(new AliasST2({
                x: false,
                y: new Bytes("68656c6c6f20776f726c6421"),
                st2: new ST3({
                    x: false,
                    y: [1, 2, 3]
                })
            }).toLiteral()).to.equal('{false,b\'68656c6c6f20776f726c6421\',{false,[1,2,3]}}')



            expect(new Bsver({
                name: new Bytes('6666'),
                friend: new Person({
                    name: new Bytes('7361746f736869206e616b616d6f746f'),
                    addr: new Bytes('6666'),
                    isMale: true,
                    age: 33,
                    blk: new Block({
                        time: 10000,
                        hash: new Bytes('68656c6c6f20776f726c6421'),
                        header: new Bytes('1156'),
                    })
                }),
                tokens: [new Token({
                    id: new Bytes('0001'),
                    createTime: 1000000
                }), new Token({
                    id: new Bytes('0002'),
                    createTime: 1000001
                }), new Token({
                    id: new Bytes('0003'),
                    createTime: 1000002
                })]
            }).toLiteral()).to.equal('{b\'6666\',[{b\'0001\',1000000},{b\'0002\',1000001},{b\'0003\',1000002}],{b\'7361746f736869206e616b616d6f746f\',b\'6666\',true,33,{b\'68656c6c6f20776f726c6421\',b\'1156\',10000}}}')


            expect(new Person({
                name: new Bytes('7361746f736869206e616b616d6f746f'),
                addr: new Bytes('68656c6c6f20776f726c6421'),
                isMale: true,
                age: 33,
                blk: new Block({
                    time: 10000,
                    hash: new Bytes('68656c6c6f20776f726c6420'),
                    header: new Bytes('1156'),
                })
            }).toLiteral()).to.equal('{b\'7361746f736869206e616b616d6f746f\',b\'68656c6c6f20776f726c6421\',true,33,{b\'68656c6c6f20776f726c6420\',b\'1156\',10000}}')

        })
    })

})