import * as React from 'react';
import { View } from 'react-native';
import murmurhash from 'murmurhash';

import Img_ant from './images/img_ant.svg';
import Img_antelope from './images/img_antelope.svg';
import Img_bass from './images/img_bass.svg';
import Img_bat from './images/img_bat.svg';
import Img_bear from './images/img_bear.svg';
import Img_beaver from './images/img_beaver.svg';
import Img_bee from './images/img_bee.svg';
import Img_beetle from './images/img_beetle.svg';
import Img_boar from './images/img_boar.svg';
import Img_bull from './images/img_bull.svg';
import Img_butterfly from './images/img_butterfly.svg';
import Img_camel from './images/img_camel.svg';
import Img_cat from './images/img_cat.svg';
import Img_chameleon from './images/img_chameleon.svg';
import Img_chicken from './images/img_chicken.svg';
import Img_clam from './images/img_clam.svg';
import Img_cobra from './images/img_cobra.svg';
import Img_cock from './images/img_cock.svg';
import Img_cockroach from './images/img_cockroach.svg';
import Img_cow from './images/img_cow.svg';
import Img_crab from './images/img_crab.svg';
import Img_croc from './images/img_croc.svg';
import Img_crow from './images/img_crow.svg';
import Img_deer from './images/img_deer.svg';
import Img_dodo from './images/img_dodo.svg';
import Img_dog from './images/img_dog.svg';
import Img_dolphin from './images/img_dolphin.svg';
import Img_dragon from './images/img_dragon.svg';
import Img_duck from './images/img_duck.svg';
import Img_eagle from './images/img_eagle.svg';
import Img_elk from './images/img_elk.svg';
import Img_falcon from './images/img_falcon.svg';
import Img_fish from './images/img_fish.svg';
import Img_flamingo from './images/img_flamingo.svg';
import Img_fly from './images/img_fly.svg';
import Img_fox from './images/img_fox.svg';
import Img_frog from './images/img_frog.svg';
import Img_gecko from './images/img_gecko.svg';
import Img_giraffe from './images/img_giraffe.svg';
import Img_gnat from './images/img_gnat.svg';
import Img_gnu from './images/img_gnu.svg';
import Img_goat from './images/img_goat.svg';
import Img_goose from './images/img_goose.svg';
import Img_gopher from './images/img_gopher.svg';
import Img_gorilla from './images/img_gorilla.svg';
import Img_griffin from './images/img_griffin.svg';
import Img_gull from './images/img_gull.svg';
import Img_hamster from './images/img_hamster.svg';
import Img_hare from './images/img_hare.svg';
import Img_hawk from './images/img_hawk.svg';
import Img_hedgehog from './images/img_hedgehog.svg';
import Img_heron from './images/img_heron.svg';
import Img_horse from './images/img_horse.svg';
import Img_hyena from './images/img_hyena.svg';
import Img_ibex from './images/img_ibex.svg';
import Img_jackal from './images/img_jackal.svg';
import Img_jaguar from './images/img_jaguar.svg';
import Img_kangaroo from './images/img_kangaroo.svg';
import Img_kitten from './images/img_kitten.svg';
import Img_kiwi from './images/img_kiwi.svg';
import Img_ladybird from './images/img_ladybird.svg';
import Img_lemur from './images/img_lemur.svg';
import Img_leopard from './images/img_leopard.svg';
import Img_lion from './images/img_lion.svg';
import Img_lizard from './images/img_lizard.svg';
import Img_llama from './images/img_llama.svg';
import Img_lynx from './images/img_lynx.svg';
import Img_mammoth from './images/img_mammoth.svg';
import Img_mantis from './images/img_mantis.svg';
import Img_meerkat from './images/img_meerkat.svg';
import Img_mink from './images/img_mink.svg';
import Img_monkey from './images/img_monkey.svg';
import Img_moth from './images/img_moth.svg';
import Img_mule from './images/img_mule.svg';
import Img_otter from './images/img_otter.svg';
import Img_owl from './images/img_owl.svg';
import Img_panda from './images/img_panda.svg';
import Img_parrot from './images/img_parrot.svg';
import Img_peacock from './images/img_peacock.svg';
import Img_penguin from './images/img_penguin.svg';
import Img_phoenix from './images/img_phoenix.svg';
import Img_pigeon from './images/img_pigeon.svg';
import Img_piranha from './images/img_piranha.svg';
import Img_pony from './images/img_pony.svg';
import Img_puffin from './images/img_puffin.svg';
import Img_pug from './images/img_pug.svg';
import Img_puma from './images/img_puma.svg';
import Img_python from './images/img_python.svg';
import Img_quokka from './images/img_quokka.svg';
import Img_rabbit from './images/img_rabbit.svg';
import Img_raccoon from './images/img_raccoon.svg';
import Img_ram from './images/img_ram.svg';
import Img_rat from './images/img_rat.svg';
import Img_raven from './images/img_raven.svg';
import Img_rhino from './images/img_rhino.svg';
import Img_scorpion from './images/img_scorpion.svg';
import Img_seal from './images/img_seal.svg';
import Img_shark from './images/img_shark.svg';
import Img_sheep from './images/img_sheep.svg';
import Img_shrimp from './images/img_shrimp.svg';
import Img_skunk from './images/img_skunk.svg';
import Img_sloth from './images/img_sloth.svg';
import Img_snail from './images/img_snail.svg';
import Img_spider from './images/img_spider.svg';
import Img_squid from './images/img_squid.svg';
import Img_squirrel from './images/img_squirrel.svg';
import Img_starfish from './images/img_starfish.svg';
import Img_swallow from './images/img_swallow.svg';
import Img_swan from './images/img_swan.svg';
import Img_tapir from './images/img_tapir.svg';
import Img_tiger from './images/img_tiger.svg';
import Img_toad from './images/img_toad.svg';
import Img_turkey from './images/img_turkey.svg';
import Img_turtle from './images/img_turtle.svg';
import Img_unicorn from './images/img_unicorn.svg';
import Img_walrus from './images/img_walrus.svg';
import Img_wasp from './images/img_wasp.svg';
import Img_whale from './images/img_whale.svg';
import Img_wolf from './images/img_wolf.svg';
import Img_wombat from './images/img_wombat.svg';
import Img_yak from './images/img_yak.svg';
import Img_zebra from './images/img_zebra.svg';

export const avatarImages = [
    Img_ant,
    Img_antelope,
    Img_bass,
    Img_bat,
    Img_bear,
    Img_beaver,
    Img_bee,
    Img_beetle,
    Img_boar,
    Img_bull,
    Img_butterfly,
    Img_camel,
    Img_cat,
    Img_chameleon,
    Img_chicken,
    Img_clam,
    Img_cobra,
    Img_cock,
    Img_cockroach,
    Img_cow,
    Img_crab,
    Img_croc,
    Img_crow,
    Img_deer,
    Img_dodo,
    Img_dog,
    Img_dolphin,
    Img_dragon,
    Img_duck,
    Img_eagle,
    Img_elk,
    Img_falcon,
    Img_fish,
    Img_flamingo,
    Img_fly,
    Img_fox,
    Img_frog,
    Img_gecko,
    Img_giraffe,
    Img_gnat,
    Img_gnu,
    Img_goat,
    Img_goose,
    Img_gopher,
    Img_gorilla,
    Img_griffin,
    Img_gull,
    Img_hamster,
    Img_hare,
    Img_hawk,
    Img_hedgehog,
    Img_heron,
    Img_horse,
    Img_hyena,
    Img_ibex,
    Img_jackal,
    Img_jaguar,
    Img_kangaroo,
    Img_kitten,
    Img_kiwi,
    Img_ladybird,
    Img_lemur,
    Img_leopard,
    Img_lion,
    Img_lizard,
    Img_llama,
    Img_lynx,
    Img_mammoth,
    Img_mantis,
    Img_meerkat,
    Img_mink,
    Img_monkey,
    Img_moth,
    Img_mule,
    Img_otter,
    Img_owl,
    Img_panda,
    Img_parrot,
    Img_peacock,
    Img_penguin,
    Img_phoenix,
    Img_pigeon,
    Img_piranha,
    Img_pony,
    Img_puffin,
    Img_pug,
    Img_puma,
    Img_python,
    Img_quokka,
    Img_rabbit,
    Img_raccoon,
    Img_ram,
    Img_rat,
    Img_raven,
    Img_rhino,
    Img_scorpion,
    Img_seal,
    Img_shark,
    Img_sheep,
    Img_shrimp,
    Img_skunk,
    Img_sloth,
    Img_snail,
    Img_spider,
    Img_squid,
    Img_squirrel,
    Img_starfish,
    Img_swallow,
    Img_swan,
    Img_tapir,
    Img_tiger,
    Img_toad,
    Img_turkey,
    Img_turtle,
    Img_unicorn,
    Img_walrus,
    Img_wasp,
    Img_whale,
    Img_wolf,
    Img_wombat,
    Img_yak,
    Img_zebra,
];

export const avatarColors = [
    '#294659',
    '#e56555',
    '#f28c48',
    '#8e85ee',
    '#76c84d',
    '#5fbed5',
    '#549cdd',
    '#f2749a',
    '#d1b04d'
];

function avatarHash(src: string, count: number) {
    return Math.abs(murmurhash.v3(Buffer.from(src))) % count;
}

export const Avatar = React.memo((props: { size: number, id: string }) => {
    let Img = avatarImages[avatarHash(props.id, avatarImages.length)];
    let color = avatarColors[avatarHash(props.id, avatarColors.length)];
    let size = Math.floor(props.size * 0.6);
    return (
        <View style={{ width: props.size, height: props.size, borderRadius: props.size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
            <Img width={size} height={size} viewBox={`0 0 320 320`} color="white" />
            <View style={{
                width: props.size, height: props.size,
                borderRadius: props.size / 2,
                borderWidth: 0.5,
                borderColor: 'black',
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                opacity: 0.06
            }} />
        </View>
    );
});