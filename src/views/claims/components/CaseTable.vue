<template>
  <table class="table table-sm table-bordered">
    <thead>
      <tr>
        <th>Claim File No</th>
        <th>File Number</th>
        <th>Created Date</th>
        <th>Subject Name</th>
        <th>Due Date</th>
        <th>Location</th>
        <th>Recommendation</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{ caseItem.claimFileNo ? caseItem.claimFileNo : "N/A" }}</td>
        <td>{{ caseItem.fileNumber }}</td>
        <td>{{ dateFormat(caseItem.createdDate) }}</td>
        <td>{{ caseItem.subjectName }}</td>
        <td>{{ dateFormat(caseItem.dueDate) }}</td>
        <td>{{ caseItem.location }}</td>
        <td>{{ caseItem.recommendation || "N/A" }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "CaseTable",
  props: {
    caseItem: { type: Object }
  },
  setup() {
    const dateFormat = (val) => {
      if (!val) return "N/A";
      const date = new Date(val);
      const options = {year: 'numeric', month: '2-digit', day: '2-digit'}
      return date.toLocaleDateString("en-US", options);
    };

    return {
      dateFormat,
    }
  }
}
</script>

<style scoped>

</style>