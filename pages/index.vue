<template>
  <div>
    <b-navbar id="navbar" sticky toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#filters">Watchdog</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="#filters">Back to top</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <div id="filters">
      <b-form-checkbox-group switches v-model="filters" size="lg">
        <b-form-checkbox value="streets">Streets</b-form-checkbox>
        <b-form-checkbox value="house">House</b-form-checkbox>
      </b-form-checkbox-group>
    </div>
    <div>
      <b-table
        id="tbl"
        :fields="this.fields"
        :items="this.filteredItems"
        striped
        hover
        small
      >
        <template v-slot:cell(camera)="data">
          <b-button
            small
            variant="link"
            @click="select(data.item.id, data.item.group)"
          >
            {{ data.item.camera }}
          </b-button>
        </template>
      </b-table>
    </div>

    <b-modal
      id="image-modal"
      size="xl"
      centered
      v-model="showModal"
      hide-header
      hide-footer
    >
      <b-carousel
        id="carousel-no-animation"
        style="text-shadow: 0px 0px 2px #000"
        no-animation
        indicators
        interval="300"
      >
        <b-carousel-slide
          v-for="(image, i) in this.selected.base64Images"
          :img-src="image"
          :key="i"
        ></b-carousel-slide>
      </b-carousel>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fields: [
        "camera",
        { key: "created_at_local", label: "Time" },
        { key: "id", class: "d-none" },
        { key: "group", class: "d-none" }
      ],
      selected: {
        id: 0,
        group: "",
        base64Image: "",
        base64Images: []
      },
      showModal: false,
      items: [],
      filters: ["streets", "house"]
    };
  },
  computed: {
    filteredItems: function() {
      let l = [];

      if (this.filters.includes("streets"))
        l = l.concat(["street1", "street2", "street3", "gate1", "burgos"]);
      if (this.filters.includes("house"))
        l = l.concat(["kitchen", "porch1", "porch2", "garage1", "garage2"]);

      return this.items.filter(p => l.includes(p.camera));
    }
  },

  methods: {
    filterItems(group) {
      console.log(group);
    },
    async select(id, group) {
      this.selected = { id, group, base64Images: [], base64Image: "" };

      const { logs } = await this.$axios.$get(`/api/images?id=${group}`);

      this.selected.base64Images = logs.map(
        p => `data:image/png;base64, ${p.base64Image}`
      );

      this.showModal = true;
    }
  },

  async mounted() {
    const { data } = await this.$axios.get("/api");

    this.items = data;
  }
};
</script>
