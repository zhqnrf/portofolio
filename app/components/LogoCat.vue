<script setup lang="ts">
import { LOGO_PATH } from '~/utils/logoPath'

// Logo asli (hasil trace). Saat di-hover simbol @ berubah jadi wajah kucing,
// matanya mengikuti kursor, dan saat diklik kucingnya mengeong.
const props = withDefaults(defineProps<{ size?: number; interactive?: boolean }>(), {
  size: 56,
  interactive: true,
})

const uid = useId()
const ids = {
  grad: `lg-${uid}`,
  inner: `li-${uid}`,
  outer: `lo-${uid}`,
  body: `lb-${uid}`,
  tail: `lt-${uid}`,
}
const url = (id: string) => `url(#${id})`

// Titik tengah kepala & ukuran rongga @ (koordinat viewBox)
const CX = 915
const CY = 931

const root = ref<HTMLElement | null>(null)
const look = reactive({ x: 0, y: 0 })
const meow = ref(false)
let t: ReturnType<typeof setTimeout> | undefined

function poke() {
  if (!props.interactive) return
  meow.value = true
  clearTimeout(t)
  t = setTimeout(() => (meow.value = false), 1400)
}

function onMove(e: PointerEvent) {
  const r = root.value?.getBoundingClientRect()
  if (!r) return
  const dx = e.clientX - (r.left + r.width / 2)
  const dy = e.clientY - (r.top + r.height * 0.46)
  const d = Math.hypot(dx, dy) || 1
  const k = Math.min(d / 120, 1) * 14
  look.x = (dx / d) * k
  look.y = (dy / d) * k
}

onMounted(() => {
  if (props.interactive) window.addEventListener('pointermove', onMove, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('pointermove', onMove))
</script>

<template>
  <span
    ref="root"
    class="logo-cat"
    :class="{ interactive, awake: meow }"
    :style="{ width: `${size}px`, height: `${size * 1.262}px` }"
    @click="poke"
  >
    <svg viewBox="580 520 656 828" role="img" aria-label="Logo Zhaqian">
      <defs>
        <linearGradient :id="ids.grad" x1="0" y1="540" x2="0" y2="1330" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#0a583e" />
          <stop offset="0.55" stop-color="#0b7068" />
          <stop offset="1" stop-color="#05718d" />
        </linearGradient>
        <!-- Bagian dalam (simbol @) -->
        <clipPath :id="ids.inner">
          <polygon points="1161,931 1160,940 1158,948 1155,956 1172,967 1171,976 1169,985 1167,994 1165,1003 1162,1011 1159,1020 1156,1028 1153,1037 1149,1045 1145,1053 1140,1061 1135,1069 1131,1076 1125,1084 1120,1091 1114,1098 1108,1105 1102,1112 1096,1118 1089,1124 1082,1130 1075,1136 1077,1153 1068,1157 1059,1162 1051,1166 1042,1169 1033,1174 1024,1176 1015,1179 1006,1182 997,1184 988,1185 979,1187 970,1189 961,1190 952,1191 942,1192 933,1193 924,1193 915,1193 906,1193 897,1192 888,1191 879,1190 870,1189 861,1186 852,1185 843,1184 833,1182 825,1179 816,1175 808,1172 799,1168 791,1164 783,1160 774,1157 767,1151 759,1145 751,1141 743,1136 736,1129 730,1123 723,1116 715,1111 709,1104 704,1096 697,1089 691,1082 687,1074 681,1066 677,1057 672,1049 668,1041 665,1032 661,1023 658,1014 655,1005 654,996 653,987 651,978 650,968 649,959 648,950 648,940 647,931 649,922 649,912 650,903 651,894 653,885 654,875 656,866 659,858 662,849 666,840 668,831 674,824 678,815 682,807 686,799 692,792 698,784 702,776 708,769 714,763 721,756 727,749 734,743 740,737 747,731 755,726 763,721 770,716 778,711 785,707 794,703 802,700 810,696 818,692 827,689 835,686 844,682 853,681 861,679 870,678 879,676 888,674 897,673 906,673 915,672 924,671 933,671 942,671 951,673 960,673 970,674 979,676 987,678 997,679 1006,681 1015,683 1024,687 1032,690 1041,693 1050,698 1058,702 1067,706 1075,710 1083,716 1091,721 1098,727 1106,733 1113,740 1119,748 1126,754 1131,762 1137,770 1141,778 1147,786 1151,795 1155,803 1158,813 1160,822 1163,831 1164,840 1166,849 1167,859 1168,868 1168,877 1168,886 1168,896 1166,905 1165,913 1163,922" />
        </clipPath>
        <!-- Kepala + telinga, tanpa @ dan ekor -->
        <mask :id="ids.outer" maskUnits="userSpaceOnUse" x="560" y="500" width="700" height="880">
          <rect x="560" y="500" width="700" height="742" fill="#ffffff" />
          <!-- Mengikuti tepi dalam kepala (diukur dari logo asli), sedikit lebih kecil dari clip @ supaya tidak ada garis sambungan -->
          <polygon points="1156,931 1155,939 1153,948 1150,956 1168,966 1166,975 1164,984 1162,993 1160,1001 1158,1010 1155,1018 1151,1027 1148,1035 1144,1043 1140,1051 1136,1059 1131,1066 1126,1074 1121,1081 1116,1088 1110,1095 1105,1102 1098,1108 1092,1114 1086,1121 1079,1126 1072,1132 1074,1149 1065,1153 1056,1157 1048,1161 1039,1165 1031,1169 1022,1171 1014,1175 1005,1177 996,1179 986,1180 978,1182 969,1184 960,1185 951,1186 942,1187 933,1188 924,1188 915,1188 906,1188 897,1187 888,1186 879,1185 870,1184 862,1181 853,1180 844,1179 835,1177 826,1174 818,1170 810,1168 801,1164 793,1160 785,1156 777,1152 770,1147 762,1141 754,1137 747,1132 740,1126 733,1119 727,1113 719,1108 713,1101 708,1093 701,1086 695,1079 691,1071 686,1064 682,1055 677,1047 673,1039 669,1030 666,1022 663,1013 660,1004 659,995 658,986 656,977 655,968 654,958 653,949 653,940 652,931 654,922 654,913 655,904 656,895 658,886 659,877 661,868 664,859 667,850 671,842 673,833 678,826 682,817 686,809 690,801 696,794 702,787 706,779 712,772 718,766 725,760 730,752 737,747 744,741 750,735 758,730 766,726 773,720 780,716 788,711 796,708 805,705 813,701 820,696 828,693 837,690 845,687 854,686 862,684 871,683 880,680 889,679 897,678 906,678 915,677 924,676 933,676 942,676 951,677 960,678 969,679 977,681 986,683 995,684 1004,686 1014,687 1022,692 1030,695 1039,698 1047,702 1055,706 1064,710 1073,714 1080,720 1088,725 1095,731 1103,737 1109,743 1115,751 1122,757 1127,765 1133,773 1137,781 1142,789 1146,797 1151,806 1153,815 1155,824 1158,833 1159,842 1161,851 1162,860 1163,869 1163,878 1163,887 1163,896 1161,905 1160,914 1158,923" fill="#000000" />
        </mask>
        <clipPath :id="ids.tail">
          <rect x="560" y="1238" width="700" height="140" />
        </clipPath>
      </defs>

      <!-- Isi kepala putih (muncul saat jadi kucing) -->
      <circle class="head-fill" :cx="CX" :cy="CY" r="268" fill="#ffffff" />

      <g :fill="url(ids.grad)" fill-rule="evenodd">
        <path :d="LOGO_PATH" :mask="url(ids.outer)" />
        <g class="tail"><path :d="LOGO_PATH" :clip-path="url(ids.tail)" /></g>
        <g class="at"><path :d="LOGO_PATH" :clip-path="url(ids.inner)" /></g>
      </g>

      <!-- Wajah kucing -->
      <g :transform="`translate(${CX} ${CY}) scale(1.18) translate(-838 -837)`">
        <g class="face" stroke-linecap="round" stroke-linejoin="round">
          <g class="blush" fill="#f4a3b8">
            <ellipse cx="702" cy="912" rx="30" ry="16" />
            <ellipse cx="974" cy="912" rx="30" ry="16" />
          </g>

          <!-- Mata (mengikuti kursor) -->
          <g class="eyes" :style="{ transform: `translate(${look.x}px, ${look.y}px)` }">
            <g class="eye eye-l">
              <ellipse cx="752" cy="826" rx="38" ry="48" :fill="url(ids.grad)" />
              <circle cx="766" cy="806" r="14" fill="#ffffff" />
              <circle cx="740" cy="846" r="6.5" fill="#ffffff" />
            </g>
            <g class="eye eye-r">
              <ellipse cx="924" cy="826" rx="38" ry="48" :fill="url(ids.grad)" />
              <circle cx="938" cy="806" r="14" fill="#ffffff" />
              <circle cx="912" cy="846" r="6.5" fill="#ffffff" />
            </g>
          </g>
          <!-- Mata senang ^^ saat diklik -->
          <g class="eyes-happy" fill="none" :stroke="url(ids.grad)" stroke-width="11">
            <path d="M718 836 Q752 790 786 836" />
            <path d="M890 836 Q924 790 958 836" />
          </g>

          <!-- Hidung: tempat simbol @ "mendarat" -->
          <path class="nose" d="M814 894 Q838 882 862 894 Q856 914 838 920 Q820 914 814 894Z" fill="#ef8aa5" />

          <g fill="none" :stroke="url(ids.grad)" stroke-width="9">
            <!-- Mulut ω -->
            <path class="mouth" pathLength="1" d="M790 934 Q796 948 812 948 Q838 948 838 918 Q838 948 864 948 Q880 948 886 934" />
            <!-- Kumis -->
            <g class="whiskers" stroke-width="7">
              <path pathLength="1" d="M690 880 L578 858" />
              <path pathLength="1" d="M688 902 L574 910" />
              <path pathLength="1" d="M986 880 L1098 858" />
              <path pathLength="1" d="M988 902 L1102 910" />
            </g>
          </g>
          <!-- Mulut terbuka saat diklik -->
          <g class="mouth-open">
            <path d="M806 930 Q838 924 870 930 Q866 984 838 986 Q810 984 806 930Z" :fill="url(ids.grad)" />
            <path d="M818 962 Q838 950 858 962 Q852 982 838 983 Q824 982 818 962Z" fill="#ef8aa5" />
          </g>
        </g>
      </g>
    </svg>
    <span v-if="interactive" class="bubble" aria-hidden="true">meow!</span>
  </span>
</template>

<style scoped>
.logo-cat { position: relative; display: inline-block; flex: none; }
.logo-cat.interactive { cursor: inherit; }
svg { width: 100%; height: 100%; display: block; overflow: visible; }

.at, .tail, .head-fill, .eye, .nose, .mouth, .mouth-open, .eyes-happy, .whiskers path {
  transform-box: fill-box;
  transform-origin: center;
}
.eyes { transition: transform .12s ease-out; }

/* ---------- Keadaan awal (logo @) — transisi balik cepat, tanpa jeda ---------- */
.at { transition: transform .4s cubic-bezier(.3, 1.3, .5, 1) .12s, opacity .2s ease .12s; }
.head-fill { opacity: 0; transition: opacity .2s ease .1s; }
.nose { opacity: 0; transform: scale(0); transition: transform .2s ease, opacity .2s ease; }
.eye { transform: scaleY(0); transition: transform .15s ease; }
.mouth, .whiskers path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset .15s ease;
}
.eyes-happy { opacity: 0; transition: opacity .15s; }
.blush { opacity: 0; transition: opacity .15s; }
.interactive:hover .blush,
.awake .blush { opacity: .85; transition: opacity .4s ease .5s; }
.mouth-open { opacity: 0; transform: scale(.3); transition: opacity .15s, transform .15s; }
.tail { transform-origin: 50% 0%; }

/* ---------- Jadi kucing: @ turun & mengecil jadi hidung, lalu wajah muncul berurutan ---------- */
.interactive:hover .at,
.awake .at {
  opacity: 0;
  transform: translateY(78px) scale(.1);
  transition: transform .42s cubic-bezier(.6, 0, .4, 1), opacity .18s ease .26s;
}
.interactive:hover .head-fill,
.awake .head-fill { opacity: 1; transition-delay: 0s; }
.interactive:hover .nose,
.awake .nose {
  opacity: 1;
  transform: scale(1);
  transition: transform .35s cubic-bezier(.3, 1.8, .5, 1) .3s, opacity .1s ease .3s;
}
.interactive:hover .eye,
.awake .eye {
  transform: scaleY(1);
  transition: transform .3s cubic-bezier(.3, 1.6, .5, 1) .42s;
}
.interactive:hover .mouth,
.awake .mouth { stroke-dashoffset: 0; transition: stroke-dashoffset .35s ease-out .48s; }
.interactive:hover .whiskers path,
.awake .whiskers path { stroke-dashoffset: 0; transition: stroke-dashoffset .3s ease-out .6s; }
.interactive:hover .whiskers path:nth-child(even),
.awake .whiskers path:nth-child(even) { transition-delay: .68s; }

/* Hidup: kedip & ekor bergoyang setelah transisi selesai */
.interactive:hover .eye { animation: blink 3.6s ease-in-out 1.6s infinite; }
.interactive:hover .tail,
.awake .tail { animation: wag 1.1s ease-in-out .5s infinite alternate; }

/* Saat diklik: mata senang & mulut terbuka */
.awake .eye { opacity: 0; }
.awake .eyes-happy { opacity: 1; }
.awake .mouth { opacity: 0; }
.awake .mouth-open { opacity: 1; transform: scale(1); transition: transform .3s cubic-bezier(.3, 1.8, .5, 1), opacity .1s; }

@keyframes wag { from { transform: rotate(-14deg); } to { transform: rotate(14deg); } }
@keyframes blink { 0%, 94%, 100% { transform: scaleY(1); } 97% { transform: scaleY(.1); } }

.bubble {
  position: absolute;
  left: 96%;
  top: -4px;
  font-family: var(--f-mono);
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  color: var(--ink);
  background: var(--bg);
  border: 1.5px solid var(--ink);
  border-radius: 8px 8px 8px 2px;
  padding: 2px 7px;
  opacity: 0;
  transform: translateY(4px) scale(.9);
  transform-origin: left bottom;
  transition: opacity .2s, transform .2s;
  pointer-events: none;
}
.awake .bubble { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .tail, .eye { animation: none !important; }
  .logo-cat * { transition-duration: .01s !important; transition-delay: 0s !important; }
}
</style>
